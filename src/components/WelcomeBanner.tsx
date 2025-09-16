import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WelcomeBanner.css';

const WelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem('welcomeBannerSeen');
    if (!hasSeenBanner) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('welcomeBannerSeen', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`welcome-banner ${isClosing ? 'closing' : ''}`}>
      <div className="welcome-content">
        <div className="welcome-text">
          <i className="fas fa-rocket"></i>
          <span>
            <strong>🎆 Nouveau !</strong> Découvrez notre catalogue de produits digitaux innovants
          </span>
        </div>
        <div className="welcome-actions">
          <Link to="/produits" className="welcome-cta">
            Découvrir
          </Link>
          <button onClick={handleClose} className="welcome-close" aria-label="Fermer">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;