import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Preload critical assets
const preloadAssets = async () => {
  try {
    // Create a promise that resolves when the DOM is fully loaded
    const domLoaded = new Promise<void>((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve());
      } else {
        resolve();
      }
    });

    // Wait for DOM to be ready
    await domLoaded;
    
    // Render the app
    const rootElement = document.getElementById('root');
    if (rootElement) {
      createRoot(rootElement).render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    }
  } catch (error) {
    console.error('Error during app initialization:', error);
    
    // Fallback rendering
    const rootElement = document.getElementById('root');
    if (rootElement) {
      createRoot(rootElement).render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    }
  }
};

// Start the app initialization
preloadAssets();

// Fallback rendering in case preloading takes too long
setTimeout(() => {
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.hasChildNodes()) {
    console.log('Fallback rendering triggered');
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}, 2000);