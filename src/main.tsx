import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize and render the app
const initializeApp = async () => {
  try {
    // Wait for DOM to be ready if it's still loading
    if (document.readyState === 'loading') {
      await new Promise<void>((resolve) => {
        document.addEventListener('DOMContentLoaded', () => resolve());
      });
    }
    
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

// Start the app
initializeApp();