import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { PhotoBoothProvider } from './context/PhotoBoothContext.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PhotoBoothProvider>
        <App />
      </PhotoBoothProvider>
    </BrowserRouter>
  </StrictMode>
);
