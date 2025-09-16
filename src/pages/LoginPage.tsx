import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import './LoginPage.css';

const NewLoginPage = () => {
  const [view, setView] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setView('login');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (view === 'login') {
        // --- Logique de Connexion ---
        const auth = await apiService.login({ email: formData.email, password: formData.password });
        login(auth); // Met à jour le contexte d'authentification

        // REDIRECTION EN FONCTION DU RÔLE
        const user = auth.user;
        if (user && user.role === 'admin') {
          navigate('/dashboard');
        } else {
          const redirectPath = localStorage.getItem('redirectAfterLogin');
          if (redirectPath) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath);
          } else {
            navigate('/');
          }
        }
      } else if (view === 'register') {
        // --- Logique d'Inscription ---
        await apiService.register(formData);
        // Redirige vers la page de connexion avec un message de succès
        navigate('/login?registered=true'); // Redirige vers la nouvelle page unifiée
      } else { // forgotPassword
        // --- Logique Mot de passe oublié ---
        await apiService.forgotPassword({ email: formData.email });
        setSuccessMessage("Si un compte avec cet email existe, un lien de réinitialisation a été envoyé.");
        setView('login'); // Revenir à la vue de connexion
      }
    } catch (err) {
      if (err instanceof Error) {
        // Pour la réinitialisation, on ne montre pas d'erreur spécifique pour la sécurité
        if (view === 'forgotPassword') {
          setSuccessMessage("Si un compte avec cet email existe, un lien de réinitialisation a été envoyé.");
          setView('login');
        } else {
          setError(err.message || 'Une erreur est survenue.');
        }
      } else {
        setError('Une erreur inconnue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>
            {view === 'login' && 'Connexion'}
            {view === 'register' && 'Inscription'}
            {view === 'forgotPassword' && 'Mot de passe oublié'}
          </h2>
          <p>
            {view === 'login' && "Vous n'avez pas de compte ?"}
            {view === 'register' && 'Vous avez déjà un compte ?'}
            {view === 'forgotPassword' && 'Retour à la connexion ?'}
            <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="auth-toggle-btn">
              {view === 'login' && 'Inscrivez-vous'}
              {view === 'register' && 'Connectez-vous'}
              {view === 'forgotPassword' && 'Connectez-vous'}
            </button>
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {successMessage && <div className="auth-success">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {view === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required />
            </div>
          )}
          {view !== 'forgotPassword' ? (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} required />
              </div>
              {view === 'login' && (
                <div className="form-group" style={{ textAlign: 'right', marginTop: '-10px' }}>
                  <button type="button" onClick={() => setView('forgotPassword')} className="auth-forgot-password-btn">
                    Mot de passe oublié ?
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required placeholder="Entrez votre email de récupération" />
            </div>
          )}
          <button type="submit" className="cta-button auth-submit-btn" disabled={loading}>
            {loading ? 'Chargement...' : (view === 'login' ? 'Se connecter' : view === 'register' ? "S'inscrire" : 'Envoyer le lien')}
          </button>
        </form>
        <div className="auth-footer">
            <Link to="/">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default NewLoginPage;
