// src/main.jsx (or src/index.js depending on your setup)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../index.css'; // Global CSS

// Create root container and render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
