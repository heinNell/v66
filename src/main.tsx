import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Preload the background image
const preloadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
};

// Preload critical assets before rendering
const preloadAssets = async () => {
  try {
    await preloadImage('/background.jpg');
    console.log('Background image preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload background image:', error);
  }
  
  // Render the app after preloading or after a timeout
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
};

// Start preloading assets
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