import { Link } from 'react-router-dom';
import './ServicesPage.css';

const ServicesPage = () => {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Nos Services Digitaux</h1>
          <p className="page-subtitle">Nous offrons une gamme complète de services digitaux pour accompagner les particuliers, entrepreneurs et entreprises dans la conception, la vente et la valorisation de leurs produits numériques.</p>
        </div>
      </section>

      <section className="services-grid-section animated-section">
        <div className="container">
          <div className="services-grid">
            <div className="service-card-detailed">
              <div className="service-icon-large">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3>Conception de Produits Digitaux</h3>
              <p>Création d'eBooks, templates, vidéos, logiciels et cours en ligne adaptés à vos besoins. Solutions clés en main pour monétiser votre expertise.</p>
              <ul className="service-features">
                <li><i className="fas fa-check"></i> eBooks et guides numériques</li>
                <li><i className="fas fa-check"></i> Templates (CV, factures, présentations)</li>
                <li><i className="fas fa-check"></i> Cours en ligne interactifs</li>
                <li><i className="fas fa-check"></i> Logiciels sur mesure</li>
              </ul>
              <div className="service-price">Dès 299€</div>
            </div>

            <div className="service-card-detailed">
              <div className="service-icon-large">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Développement Web & Mobile</h3>
              <p>Sites vitrines, e-commerce et applications mobiles sur mesure. Solutions modernes et responsives pour digitaliser votre activité.</p>
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Sites web responsives</li>
                <li><i className="fas fa-check"></i> Plateformes e-commerce</li>
                <li><i className="fas fa-check"></i> Applications mobiles</li>
                <li><i className="fas fa-check"></i> Outils métier personnalisés</li>
              </ul>
              <div className="service-price">Dès 1 200€</div>
            </div>

            <div className="service-card-detailed">
              <div className="service-icon-large">
                <i className="fas fa-store"></i>
              </div>
              <h3>Vente de Ressources Digitales</h3>
              <p>Accès à notre bibliothèque de produits prêts à l'emploi. Téléchargement immédiat et paiements sécurisés.</p>
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Catalogue de 500+ produits</li>
                <li><i className="fas fa-check"></i> Téléchargement instantané</li>
                <li><i className="fas fa-check"></i> Paiements sécurisés</li>
                <li><i className="fas fa-check"></i> Support client dédié</li>
              </ul>
              <div className="service-price">Dès 9€</div>
            </div>

            <div className="service-card-detailed">
              <div className="service-icon-large">
                <i className="fas fa-paint-brush"></i>
              </div>
              <h3>Design Graphique & Branding</h3>
              <p>Logos, chartes graphiques et supports visuels pour renforcer votre identité de marque et vous démarquer de la concurrence.</p>
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Création de logos</li>
                <li><i className="fas fa-check"></i> Chartes graphiques</li>
                <li><i className="fas fa-check"></i> Supports de communication</li>
                <li><i className="fas fa-check"></i> Identité visuelle complète</li>
              </ul>
              <div className="service-price">Dès 450€</div>
            </div>

            <div className="service-card-detailed">
              <div className="service-icon-large">
                <i className="fas fa-bullhorn"></i>
              </div>
              <h3>Marketing Digital</h3>
              <p>Stratégies digitales pour promouvoir vos produits et services. SEO, réseaux sociaux et campagnes publicitaires ciblées.</p>
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Optimisation SEO</li>
                <li><i className="fas fa-check"></i> Gestion réseaux sociaux</li>
                <li><i className="fas fa-check"></i> Campagnes publicitaires</li>
                <li><i className="fas fa-check"></i> Analyse de performance</li>
              </ul>
              <div className="service-price">Dès 350€/mois</div>
            </div>

            <div className="service-card-detailed">
              <div className="service-icon-large">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Transformation Numérique</h3>
              <p>Accompagnement complet pour digitaliser vos processus métier et optimiser votre productivité grâce aux outils digitaux.</p>
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Audit digital</li>
                <li><i className="fas fa-check"></i> Automatisation des processus</li>
                <li><i className="fas fa-check"></i> Formation des équipes</li>
                <li><i className="fas fa-check"></i> Suivi et optimisation</li>
              </ul>
              <div className="service-price">Sur devis</div>
            </div>
          </div>
        </div>
      </section>

      <section className="service-process animated-section">
        <div className="container">
          <h2 className="section-title">Notre processus de travail</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h4>Analyse</h4>
              <p>Nous étudions vos besoins et objectifs pour proposer la solution idéale</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h4>Conception</h4>
              <p>Création et développement de votre solution digitale sur mesure</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h4>Livraison</h4>
              <p>Tests, validation et mise en ligne de votre projet finalisé</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h4>Support</h4>
              <p>Accompagnement continu et maintenance pour garantir le succès</p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta-section animated-section">
        <div className="container">
          <h2 className="section-title">Prêt à digitaliser votre projet ?</h2>
          <p>Obtenez un devis personnalisé et démarrez votre transformation digitale dès aujourd'hui</p>
          <div className="cta-buttons">
            <Link to="/contact" className="cta-button primary">Demander un devis gratuit</Link>
            <Link to="/produits" className="cta-button secondary">Découvrir nos produits</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;