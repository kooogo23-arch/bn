import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, APP_CONFIG } from '../config/constants';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p className="footer-copyright">&copy; {APP_CONFIG.CURRENT_YEAR} {APP_CONFIG.COMPANY_NAME}. Tous droits réservés.</p>
        <div className="footer-social">
          <a href={SOCIAL_LINKS.TWITTER} target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Twitter"><i className="fab fa-twitter"></i></a>
          <a href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          <a href={SOCIAL_LINKS.GITHUB} target="_blank" rel="noopener noreferrer" aria-label="Découvrez nos projets sur GitHub"><i className="fab fa-github"></i></a>
        </div>
        <nav className="footer-nav">
          <Link to="/politique-confidentialite">Politique de confidentialité</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;