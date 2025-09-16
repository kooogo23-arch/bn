import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../hooks/useAuth';
import { APP_CONFIG } from '../config/constants';
import WelcomeBanner from './WelcomeBanner';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode, toggleDarkMode] = useDarkMode();
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Nettoyage au démontage du composant
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavLinkClick = () => setIsMenuOpen(false);

  const handleLogout = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (logout) {
      await logout();
    }
    navigate('/');
    handleNavLinkClick();
  }, [logout, navigate]);

  return (
    <header className="main-header">
      <WelcomeBanner />
      <nav className="navbar">
        <Link to="/" className="nav-logo">{APP_CONFIG.COMPANY_NAME}</Link>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink to="/" className="nav-link" onClick={handleNavLinkClick}>
              <i className="fas fa-home"></i>
              <span>Accueil</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/services" className="nav-link" onClick={handleNavLinkClick}>
              <i className="fas fa-cogs"></i>
              <span>Services</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/produits" className="nav-link" onClick={handleNavLinkClick}>
              <i className="fas fa-cube"></i>
              <span>Produits</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/projets" className="nav-link" onClick={handleNavLinkClick}>
              <i className="fas fa-folder-open"></i>
              <span>Projets</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/blog" className="nav-link" onClick={handleNavLinkClick}>
              <i className="fas fa-blog"></i>
              <span>Blog</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-link cta-nav" onClick={handleNavLinkClick}>
              <i className="fas fa-envelope"></i>
              <span>Contact</span>
            </NavLink>
          </li>
          {/* Auth links moved to right-side actions for better positioning */}
        </ul>
          {/* <div className={`nav-social ${isMenuOpen ? 'mobile-visible' : ''}`}>
          <a href={SOCIAL_LINKS.TWITTER} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href={SOCIAL_LINKS.GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
        </div> */}
        <div className="nav-controls">
          <div className="auth-actions">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/dashboard" className="auth-btn mobile-hidden" title="Tableau de bord" onClick={handleNavLinkClick}>
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                  </Link>
                )}
                <Link to="/profile" className="auth-btn" title="Profil" onClick={handleNavLinkClick}>
                  <i className="fas fa-user"></i>
                  <span>Profil</span>
                </Link>
                <a href="#" className="auth-btn danger mobile-hidden" onClick={handleLogout} title="Déconnexion">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Déconnexion</span>
                </a>
              </>
            ) : (
              <Link to="/login" className="auth-btn primary" title="Connexion" onClick={handleNavLinkClick}>
                <i className="fas fa-sign-in-alt"></i>
                <span>Connexion</span>
              </Link>
            )}
          </div>
          {/* Toggle pour le mode sombre */}
          <button 
            className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;