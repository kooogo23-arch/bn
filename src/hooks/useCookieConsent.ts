import { useState, useCallback, useEffect } from 'react';
import { COOKIE_KEYS } from '../config/constants';

type ConsentStatus = 'pending' | 'accepted' | 'declined';

export const useCookieConsent = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => {
    if (typeof window === 'undefined') return 'pending';
    
    try {
      const stored = localStorage.getItem(COOKIE_KEYS.CONSENT);
      if (stored === 'true') return 'accepted';
      if (stored === 'false') return 'declined';
      return 'pending';
    } catch {
      return 'pending';
    }
  });

  const acceptCookies = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_KEYS.CONSENT, 'true');
      localStorage.setItem(COOKIE_KEYS.CONSENT_DATE, new Date().toISOString());
      setConsentStatus('accepted');
    } catch (error) {
      console.warn('Impossible de sauvegarder le consentement aux cookies:', error);
      setConsentStatus('accepted');
    }
  }, []);

  const declineCookies = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_KEYS.CONSENT, 'false');
      localStorage.setItem(COOKIE_KEYS.CONSENT_DATE, new Date().toISOString());
      setConsentStatus('declined');
    } catch (error) {
      console.warn('Impossible de sauvegarder le refus des cookies:', error);
      setConsentStatus('declined');
    }
  }, []);

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(COOKIE_KEYS.CONSENT);
      localStorage.removeItem(COOKIE_KEYS.CONSENT_DATE);
      setConsentStatus('pending');
    } catch (error) {
      console.warn('Impossible de réinitialiser le consentement:', error);
      setConsentStatus('pending');
    }
  }, []);

  // Vérifier si le consentement a expiré (1 an)
  useEffect(() => {
    if (consentStatus === 'pending') return;

    try {
      const consentDate = localStorage.getItem(COOKIE_KEYS.CONSENT_DATE);
      if (consentDate) {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        if (new Date(consentDate) < oneYearAgo) {
          resetConsent();
        }
      }
    } catch {
      // Ignorer les erreurs de date
    }
  }, [consentStatus, resetConsent]);

  return {
    consentStatus,
    hasConsented: consentStatus === 'accepted',
    hasDeclined: consentStatus === 'declined',
    isPending: consentStatus === 'pending',
    acceptCookies,
    declineCookies,
    resetConsent
  };
};