import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { endpoint } = req.query;
    
    if (!endpoint || typeof endpoint !== 'string') {
      res.status(400).json({ error: 'Endpoint parameter is required' });
      return;
    }

    // Access process.env securely. Vercel automatically exposes env vars.
    const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || '';
    const TMDB_ACCESS_TOKEN = process.env.VITE_TMDB_READ_ACCESS_TOKEN || '';
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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
    res.status(200).json(data);
  } catch (error: any) {
    console.error('TMDB Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch from TMDB', message: error.message });
  }
}
