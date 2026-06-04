import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Use TMDB API Keys from server environment (secure & bypasses adblockers)
  const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || '';
  const TMDB_ACCESS_TOKEN = process.env.VITE_TMDB_READ_ACCESS_TOKEN || '';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  app.get('/api/tmdb', async (req, res) => {
    try {
      const { endpoint } = req.query;
      
      if (!endpoint || typeof endpoint !== 'string') {
        res.status(400).json({ error: 'Endpoint parameter is required' });
        return;
      }

      let url = `${TMDB_BASE_URL}${endpoint}`;
      
      const options: RequestInit = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        }
      };
      
      if (TMDB_ACCESS_TOKEN) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
        };
      } else if (TMDB_API_KEY) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}api_key=${TMDB_API_KEY}`;
      } else {
        res.status(401).json({ error: 'TMDB API key is not configured on the server' });
        return;
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        res.status(response.status).json({ 
          error: `TMDB API error: ${response.status}`, 
          details: errorText 
        });
        return;
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('TMDB Proxy Error:', error);
      res.status(500).json({ error: 'Failed to fetch from TMDB', message: error.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v4 wildcard
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
