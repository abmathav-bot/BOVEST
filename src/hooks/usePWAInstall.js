import { useState, useEffect } from 'react';

/**
 * Shared PWA install hook.
 * Returns:
 *   installPrompt  – the deferred beforeinstallprompt event (Android/desktop Chrome)
 *   isInstalled    – true when already running as standalone PWA
 *   isIOS          – true when on iOS (Safari) — no native prompt, needs manual steps
 *   triggerInstall – call this to show the native install dialog
 */
export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://');

  useEffect(() => {
    if (isStandalone) { setIsInstalled(true); return; }

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
    return outcome === 'accepted';
  };

  return { installPrompt, isInstalled, isIOS, isStandalone, triggerInstall };
}
