import { useEffect, useRef, useState } from 'react';

const POLL_MS = 30000; // check every 30s

export default function VersionWatcher() {
  const [updateReady, setUpdateReady] = useState(false);
  const timerRef = useRef<number | null>(null);
  const currentRef = useRef<{ version: string; builtAt: string } | null>(null);

  useEffect(() => {
    let canceled = false;

    const check = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://projetbooklite-backend.onrender.com';
        const response = await fetch(`${API_URL}/api/version`);
        const v = await response.json();
        
        if (!currentRef.current) {
          currentRef.current = v;
          return;
        }
        // If builtAt or version changed -> update available
        if (
          (v.version && v.version !== currentRef.current.version) ||
          (v.builtAt && v.builtAt !== currentRef.current.builtAt)
        ) {
          if (!canceled) {
            setUpdateReady(true);
            // Auto-reload after a small delay for smoothness
            window.setTimeout(() => {
              // Try to scroll position preserve
              const scrollY = window.scrollY;
              window.location.reload();
              window.scrollTo(0, scrollY);
            }, 8000);
          }
        }
      } catch (e) {
        // ignore fetch errors; try again next tick
      }
    };

    // initial and interval
    check();
    timerRef.current = window.setInterval(check, POLL_MS) as unknown as number;

    return () => {
      canceled = true;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  if (!updateReady) return null;

  return (
    <div className="update-banner" role="status" aria-live="polite">
      <div className="container">
        <span>Une nouvelle version du site est disponible.</span>
        <button
          className="update-button"
          onClick={() => {
            window.location.reload();
          }}
        >
          Mettre à jour maintenant
        </button>
      </div>
    </div>
  );
}
