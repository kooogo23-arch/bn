import { APP_CONFIG, CONTACT_INFO } from '../config/constants';

const PrivacyPolicyPage = () => {

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Politique de Confidentialité</h1>
          <p className="page-subtitle">Votre confiance est importante pour nous.</p>
        </div>
      </section>

      <section className="legal-content animated-section">
        <div className="container">
          <p><em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em></p>

          <h2>1. Responsable du traitement</h2>
          <p>Le responsable du traitement des données personnelles est {APP_CONFIG.COMPANY_NAME}, situé à {CONTACT_INFO.ADDRESS}.</p>
          
          <h2>2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul>
            <li><strong>Via le formulaire de contact :</strong> nom, adresse e-mail, message</li>
            <li><strong>Cookies techniques :</strong> préférences utilisateur (thème, consentement)</li>
            <li><strong>Données de navigation :</strong> adresse IP, navigateur, pages visitées (anonymisées)</li>
          </ul>
          
          <h2>3. Finalités du traitement</h2>
          <p>Vos données sont traitées pour les finalités suivantes :</p>
          <ul>
              <li><strong>Gestion des demandes :</strong> répondre à vos questions (base légale : intérêt légitime)</li>
              <li><strong>Amélioration du service :</strong> optimiser l'expérience utilisateur (base légale : intérêt légitime)</li>
              <li><strong>Cookies techniques :</strong> fonctionnement du site (base légale : intérêt légitime)</li>
              <li><strong>Respect des obligations légales :</strong> conservation des échanges (base légale : obligation légale)</li>
          </ul>

          <h2>4. Durée de conservation</h2>
          <ul>
            <li><strong>Demandes de contact :</strong> 3 ans après le dernier échange</li>
            <li><strong>Cookies de préférences :</strong> 1 an maximum</li>
            <li><strong>Logs de connexion :</strong> 12 mois maximum</li>
          </ul>
          
          <h2>5. Partage des données</h2>
          <p>Vos données personnelles ne sont jamais vendues, louées ou cédées à des tiers à des fins commerciales. Elles peuvent être partagées uniquement dans les cas suivants :</p>
          <ul>
            <li>Prestataires techniques (hébergement) sous contrat de sous-traitance</li>
            <li>Autorités compétentes sur réquisition judiciaire</li>
          </ul>

          <h2>6. Cookies et traceurs</h2>
          <p>Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du site :</p>
          <ul>
            <li><strong>Préférences utilisateur :</strong> thème sombre/clair</li>
            <li><strong>Consentement :</strong> mémorisation de vos choix</li>
            <li><strong>Sécurité :</strong> protection contre les attaques</li>
          </ul>
          <p>Aucun cookie publicitaire ou de traçage n'est utilisé.</p>

          <h2>7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> connaître les données vous concernant</li>
            <li><strong>Droit de rectification :</strong> corriger vos données</li>
            <li><strong>Droit à l'effacement :</strong> supprimer vos données</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement</li>
            <li><strong>Droit à la portabilité :</strong> récupérer vos données</li>
            <li><strong>Droit de limitation :</strong> limiter le traitement</li>
          </ul>
          <p>Pour exercer ces droits, contactez-nous à : <a href="mailto:{CONTACT_INFO.EMAIL}">{CONTACT_INFO.EMAIL}</a></p>
          <p>Vous pouvez également déposer une réclamation auprès de la CNIL.</p>

          <h2>8. Sécurité</h2>
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
          <ul>
            <li>Chiffrement des communications (HTTPS)</li>
            <li>Accès restreint aux données</li>
            <li>Sauvegardes sécurisées</li>
            <li>Mise à jour régulière des systèmes</li>
          </ul>
          
          <h2>9. Contact DPO</h2>
          <p>Pour toute question relative à la protection de vos données :</p>
          <ul>
            <li><strong>Email :</strong> <a href="mailto:{CONTACT_INFO.EMAIL}">{CONTACT_INFO.EMAIL}</a></li>
            <li><strong>Adresse :</strong> {CONTACT_INFO.ADDRESS}</li>
            <li><strong>Téléphone :</strong> {CONTACT_INFO.PHONE}</li>
          </ul>
          
          <h2>10. Modifications</h2>
          <p>Cette politique peut être modifiée. La date de dernière mise à jour est indiquée en haut de cette page.</p>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;