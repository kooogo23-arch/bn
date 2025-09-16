import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import './LoginPage.css'; // Réutiliser le style de la page de connexion

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('Jeton de réinitialisation manquant ou invalide. Veuillez refaire une demande.');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!token) {
      setError('Jeton de réinitialisation manquant.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      await apiService.resetPassword({
        token,
        newPassword: formData.newPassword,
      });
      setSuccessMessage('Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.');
      // ..Optionnel:ediriger après un délai
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Une erreur est survenue.');
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
          <h2>Réinitialiser le mot de passe</h2>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {successMessage && <div className="auth-success">{successMessage}</div>}

        {token && !successMessage && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleInputChange} required autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required autoComplete="new-password" />
            </div>
            <button type="submit" className="cta-button auth-submit-btn" disabled={loading}>
              {loading ? 'Chargement...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}

        {(successMessage || !token) && (
           <div className="auth-footer">
             <Link to="/login">Retour à la page de connexion</Link>
           </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;