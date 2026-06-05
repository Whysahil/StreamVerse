import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/layout/ErrorBoundary.tsx';

// Suppress known benign Recharts and React 18 defaultProps warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && /defaultProps will be removed/.test(args[0])) return;
  if (typeof args[0] === 'string' && /Support for defaultProps will be removed/.test(args[0])) return;
  originalConsoleError(...args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && /defaultProps will be removed/.test(args[0])) return;
  originalConsoleWarn(...args);
};

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason && 
    (event.reason.name === 'ChunkLoadError' || 
     (event.reason.message && event.reason.message.includes('fetch dynamically imported module')))
  ) {
    event.preventDefault();
    const hasReloaded = sessionStorage.getItem('chunk-load-reload');
    if (!hasReloaded) {
      sessionStorage.setItem('chunk-load-reload', 'true');
      window.location.reload();
    }
  } else if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
    // Ignore benign background fetch errors to prevent crash loops
    console.warn('Unhandled fetch error gracefully ignored:', event.reason);
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
