import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = 'darkMode';
const DARK_CLASS = 'dark';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      // Vérifier d'abord localStorage, puis les préférences système
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
    } catch {
      return false;
    }
  });

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  useEffect(() => {
    const body = document.body;
    
    if (isDarkMode) {
      body.classList.add(DARK_CLASS);
    } else {
      body.classList.remove(DARK_CLASS);
    }

    // Sauvegarder dans localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isDarkMode));
    } catch {
      // Ignorer les erreurs de localStorage (mode privé, etc.)
    }
  }, [isDarkMode]);

  // Écouter les changements de préférences système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Ne changer que si aucune préférence utilisateur n'est sauvegardée
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return [isDarkMode, setIsDarkMode, toggleDarkMode] as const;
}
