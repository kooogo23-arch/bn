import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SOCIAL_LINKS } from '../config/constants';
import './ContactPage.css';
import { apiService } from '../services/api';

// Définition des types pour le formulaire et les erreurs
interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

const ContactPage = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Le nom est requis.';
        if (!formData.email.trim()) {
            newErrors.email = "L'adresse e-mail est requise.";
        } else if (!/^[^S@]+@[^S@]+\.[^S@]+$/.test(formData.email)) {
            newErrors.email = "L'adresse e-mail est invalide.";
        }
        if (!formData.message.trim()) newErrors.message = 'Le message ne peut pas être vide.';

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                await apiService.sendContactForm(formData);
                setIsSubmitted(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setErrors({ message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' });
            }
        }
    };

    if (isSubmitted) {
        return (
            <section className="contact-section animated-section visible">
                <div className="container text-center">
                    <div className="success-message">
                        <i className="fas fa-check-circle"></i>
                        <h1 className="page-title">Message envoyé avec succès !</h1>
                        <p className="page-subtitle">Nous avons bien reçu votre demande. Notre équipe vous répondra sous 24h maximum.</p>
                        <div className="next-steps">
                            <h3>Prochaines étapes :</h3>
                            <ul>
                                <li>Analyse de votre demande par notre équipe</li>
                                <li>Réponse personnalisée sous 24h</li>
                                <li>Proposition de rendez-vous si nécessaire</li>
                            </ul>
                        </div>
                        <Link to="/" className="cta-button">Retour à l\'accueil</Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="contact-section animated-section">
            <div className="container">
                <h1 className="page-title">Contactez-nous</h1>
                <p className="page-subtitle">Vous avez un projet de modélisation de données ? Parlons-en ensemble !</p>

                <div className="contact-wrapper">
                    <div className="contact-form-container">
                        <div className="form-header">
                            <h3>Parlez-nous de votre projet</h3>
                            <p>Tous les champs sont obligatoires. Réponse garantie sous 24h.</p>
                        </div>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="name">
                                    <i className="fas fa-user"></i>
                                    Nom complet *
                                </label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Votre nom et prénom"
                                    required 
                                    className={errors.name ? 'error' : ''} 
                                />
                                {errors.name && <p className="error-message">{errors.name}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">
                                    <i className="fas fa-envelope"></i>
                                    Adresse e-mail *
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    placeholder="votre.email@exemple.com"
                                    required 
                                    className={errors.email ? 'error' : ''} 
                                />
                                {errors.email && <p className="error-message">{errors.email}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">
                                    <i className="fas fa-heading"></i>
                                    Sujet *
                                </label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    name="subject" 
                                    value={formData.subject} 
                                    onChange={handleChange} 
                                    placeholder="Sujet de votre message"
                                    required 
                                    className={errors.subject ? 'error' : ''} 
                                />
                                {errors.subject && <p className="error-message">{errors.subject}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">
                                    <i className="fas fa-comment"></i>
                                    Décrivez votre projet *
                                </label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows={6} 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    placeholder="Décrivez votre projet, vos besoins, votre contexte..."
                                    required 
                                    className={errors.message ? 'error' : ''}
                                ></textarea>
                                {errors.message && <p className="error-message">{errors.message}</p>}
                            </div>
                            <div className="form-footer">
                                <p className="privacy-notice">
                                    <i className="fas fa-shield-alt"></i>
                                    Vos données sont protégées. Consultez notre <Link to="/politique-confidentialite">politique de confidentialité</Link>.
                                </p>
                                <button type="submit" className="cta-button primary">
                                    <i className="fas fa-paper-plane"></i>
                                    Envoyer ma demande
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="contact-info-container">
                        <h3>Nos Coordonnées</h3>
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Adresse</strong>
                                <p>{CONTACT_INFO.ADDRESS}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <div>
                                <strong>Email</strong>
                                <p><a href={`mailto:${CONTACT_INFO.EMAIL}`}>{CONTACT_INFO.EMAIL}</a></p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-phone"></i>
                            <div>
                                <strong>Téléphone</strong>
                                <p><a href={`tel:${CONTACT_INFO.PHONE}`}>{CONTACT_INFO.PHONE}</a></p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-clock"></i>
                            <div>
                                <strong>Horaires</strong>
                                <p>Lun - Ven : 8h - 18h<br/>Sam : 9h - 12h</p>
                            </div>
                        </div>
                        <div className="contact-social">
                            <h4>Suivez-nous</h4>
                            <a href={SOCIAL_LINKS.TWITTER} target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Twitter"><i className="fab fa-twitter"></i></a>
                            <a href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href={SOCIAL_LINKS.GITHUB} target="_blank" rel="noopener noreferrer" aria-label="Découvrez nos projets sur GitHub"><i className="fab fa-github"></i></a>
                        </div>
                    </div>
                </div>
                {/* <ContactMap /> */}
                <div className="contact-faq">
                    <h3>Questions fréquentes</h3>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4><i className="fas fa-question-circle"></i> Quel est le délai de réponse ?</h4>
                            <p>Nous répondons à toutes les demandes sous 24h maximum, souvent plus rapidement.</p>
                        </div>
                        <div className="faq-item">
                            <h4><i className="fas fa-euro-sign"></i> Comment sont calculés les tarifs ?</h4>
                            <p>Nos tarifs dépendent de la complexité du projet. Devis gratuit et personnalisé.</p>
                        </div>
                        <div className="faq-item">
                            <h4><i className="fas fa-calendar"></i> Quels sont vos délais de livraison ?</h4>
                            <p>De 1 à 4 semaines selon le projet. Délais précisés dans le devis.</p>
                        </div>
                        <div className="faq-item">
                            <h4><i className="fas fa-handshake"></i> Proposez-vous un suivi après livraison ?</h4>
                            <p>Oui, support inclus pendant 3 mois après la livraison du projet.</p>
                        </div>
                    </div>
                </div>
                
                <div className="contact-cta">
                    <h3>Pourquoi choisir Booklite ?</h3>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <i className="fas fa-database"></i>
                            <h4>Expertise Merise</h4>
                            <p>Maîtrise complète de la méthode Merise et 50+ projets réalisés</p>
                        </div>
                        <div className="benefit-item">
                            <i className="fas fa-clock"></i>
                            <h4>Réactivité</h4>
                            <p>Réponse sous 24h, délais respectés, livraison dans les temps</p>
                        </div>
                        <div className="benefit-item">
                            <i className="fas fa-shield-alt"></i>
                            <h4>Qualité garantie</h4>
                            <p>Solutions robustes, documentation complète, support 3 mois inclus</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;