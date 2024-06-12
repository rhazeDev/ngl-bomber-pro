import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GameSlugProvider } from './components/GameSlug';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameSlugProvider value={{ gameSlug: "normal" }}>
      <App />
    </GameSlugProvider>
  </React.StrictMode>
);