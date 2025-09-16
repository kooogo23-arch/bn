import React from 'react';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../hooks/useCookieConsent';

const CookieBanner = () => {
  const [hasConsented, acceptCookies] = useCookieConsent();

  // Le composant ne s'affiche pas si le consentement a déjà été donné.
  if (hasConsented) {
    return null;
  }

  return (
    <div id="cookie-banner" className="cookie-banner show">
      <p>
        Ce site utilise des cookies pour améliorer votre expérience. En continuant, vous acceptez notre{' '}
        <Link to="/politique-confidentialite">politique de confidentialité</Link>.
      </p>
      <button id="cookie-accept-btn" className="cta-button" onClick={acceptCookies}>
        Accepter
      </button>
    </div>
  );
};

export default CookieBanner;