import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './theme.css';
import './invoices.css';
import './support.css';
import './agreement.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update on new content
const updateSW = registerSW({
  onNeedRefresh() {
    // New content available — prompt the user to refresh
    if (confirm('New version of Bovest is available. Update now?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Bovest is ready to work offline!');
  },
  onRegistered(r) {
    // Check for updates every hour
    r && setInterval(() => r.update(), 60 * 60 * 1000);
  },
  onRegisterError(error) {
    console.error('SW registration error', error);
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
);
