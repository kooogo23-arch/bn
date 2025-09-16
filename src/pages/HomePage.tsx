import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import KeyFiguresSection from '../components/KeyFiguresSection';
import AnimatedSection from '../components/AnimatedSection';
import './HomePage.css';

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  

  
  return (
    <>
      {/* 1. Section Supérieure (Above the Fold) */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenue chez Booklite - Votre Agence Digitale Innovante</h1>
          <p className="hero-subtitle">Nous concevons et vendons des produits numériques adaptés aux particuliers, entrepreneurs et entreprises. Notre mission : transformer vos idées en solutions digitales efficaces et accessibles.</p>
          <div className="hero-buttons">
            <Link to="/produits" className="cta-button primary">Découvrir nos produits</Link>
            <Link to="/contact" className="cta-button secondary">Nous contacter</Link>
          </div>
        </div>
      </section>

      {/* 2. Mise en avant de l'Expertise */}
      <AnimatedSection id="services" className="services-section">
        <h6 className="section-title">Ce que nous faisons</h6>
        <div className="services-container">
          <div className="service-card">
            <i className="fas fa-laptop-code service-icon" aria-hidden="true"></i>
            <h3>Produits Digitaux</h3>
            <p>eBooks, cours a télécharger, modèles (CV, factures), logiciels et vidéos prêts à l'emploi.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-mobile-alt service-icon" aria-hidden="true"></i>
            <h3>Développement Sur Mesure</h3>
            <p>Sites web, applications mobiles et outils adaptés à votre activité et vos besoins spécifiques.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-store service-icon" aria-hidden="true"></i>
            <h3>Plateforme de Vente</h3>
            <p>Large bibliothèque de ressources digitales disponibles avec téléchargement immédiat.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-paint-brush service-icon" aria-hidden="true"></i>
            <h3>Services Complémentaires</h3>
            <p>Design graphique, branding, marketing digital et accompagnement à la transformation numérique.</p>
          </div>
        </div>
      </AnimatedSection>

      <KeyFiguresSection />

      {/* 3. Section "Pourquoi nous choisir ?" */}
      <AnimatedSection id="pourquoi-nous" className="why-us-section">
        <div className="container">
          <h2 className="section-title">Notre valeur ajoutée</h2>
          <ul className="advantages-list">
            <li><i className="fas fa-check-circle" aria-hidden="true"></i><span><strong>Produits de qualité :</strong> Solutions 100% digitales, prêtes à l'emploi et testées.</span></li>
            <li><i className="fas fa-check-circle" aria-hidden="true"></i><span><strong>Pour tous :</strong> Adaptées aux particuliers, entrepreneurs et entreprises.</span></li>
            <li><i className="fas fa-check-circle" aria-hidden="true"></i><span><strong>Paiements sécurisés :</strong> Cartes, mobile money et téléchargement immédiat.</span></li>
            <li><i className="fas fa-check-circle" aria-hidden="true"></i><span><strong>Accompagnement personnalisé :</strong> Support dédié pour vos projets digitaux.</span></li>
          </ul>
        </div>
      </AnimatedSection>


      {/* 4. Témoignages et Preuve Sociale */}
      <AnimatedSection id="temoignages" className="testimonials-section">
        <h2 className="section-title">Ils nous font confiance</h2>
        <TestimonialsCarousel />
        <div className="partner-logos">
          <div className="partner-item">
            <i className="fas fa-building"></i>
            <span>TechCorp</span>
          </div>
          <div className="partner-item">
            <i className="fas fa-lightbulb"></i>
            <span>InnovaSolutions</span>
          </div>
          <div className="partner-item">
            <i className="fas fa-chart-line"></i>
            <span>DataDriven</span>
          </div>
        </div>
      </AnimatedSection>

      {/* 6. Section FAQ */}
      <AnimatedSection id="faq" className="faq-section">
        <div className="container">
            <h2 className="section-title">Questions Fréquemment Posées</h2>
            <div className="faq-container">
                {[
                  {
                    question: "👥 À qui s'adressent vos produits ?",
                    answer: "Nos solutions s'adressent aux entrepreneurs & startups, étudiants & formateurs, artistes & créateurs, ainsi qu'aux PME & grandes entreprises souhaitant digitaliser leurs activités."
                  },
                  {
                    question: "💳 Quels moyens de paiement acceptez-vous ?",
                    answer: "Nous acceptons les cartes bancaires, le mobile money et d'autres solutions de paiement sécurisées. Le téléchargement est immédiat après validation du paiement."
                  },
                  {
                    question: "🛠️ Proposez-vous du développement sur mesure ?",
                    answer: "Oui ! Nous créons des sites web, applications mobiles et outils personnalisés adaptés à votre activité et vos besoins spécifiques."
                  }
                ].map((faq, index) => (
                  <div key={index} className="faq-item">
                    <button 
                      className="faq-question" 
                      aria-expanded={openFaq === index}
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{faq.question}</span>
                      <i className={`fas fa-chevron-${openFaq === index ? 'up' : 'down'}`} aria-hidden="true"></i>
                    </button>
                    <div className={`faq-answer ${openFaq === index ? 'open' : ''}`} role="region">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
            </div>
        </div>
      </AnimatedSection>

      {/* 5. Dernier Appel à l'Action */}
      <AnimatedSection className="final-cta-section">
        <div className="container">
          <h2 className="section-title">Notre vision</h2>
          <p>Construire une référence en Afrique et à l'international dans la conception, la distribution et l'innovation digitale, en mettant la créativité et la technologie au service de tous.</p>
          <div className="hero-buttons">
            <Link to="/produits" className="cta-button primary">Découvrir nos produits</Link>
            <Link to="/contact" className="cta-button secondary">Démarrer un projet</Link>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
};

export default HomePage;