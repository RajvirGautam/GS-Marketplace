import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Reveal after first paint — prevents FOUC from Tailwind CDN processing delay
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.getElementById('root').style.opacity = '1';
}));