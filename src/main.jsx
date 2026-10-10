import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './theme.css';
import './invoices.css';
import './support.css';
import './agreement.css';

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
);
