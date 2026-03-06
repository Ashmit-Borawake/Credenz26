import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ModelLoadingProvider } from './context/ModelLoadingProvider.jsx';
import { initPerformanceMonitoring } from './utils/performance.js';

// Initialize performance monitoring
initPerformanceMonitoring();

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <ModelLoadingProvider>
        <App />
      </ModelLoadingProvider>
    </BrowserRouter>
);
