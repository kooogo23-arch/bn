import { useState } from 'react';
import { apiService } from '../services/api';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendTestEmail = async (type: string) => {
    setLoading(true);
    try {
      const result = await apiService.sendTestEmail(type);
      setMessage(`Email ${type} envoyé avec succès !`);
    } catch (error) {
      setMessage(`Erreur lors de l'envoi de l'email ${type}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="notification-center">
      <h3>Centre de notifications</h3>
      <div className="notification-actions">
        <button 
          className="notification-btn purchase"
          onClick={() => sendTestEmail('purchase_confirmation')}
          disabled={loading}
        >
          <i className="fas fa-shopping-cart"></i>
          Test email achat
        </button>
        
        <button 
          className="notification-btn vendor"
          onClick={() => sendTestEmail('vendor_sale_notification')}
          disabled={loading}
        >
          <i className="fas fa-store"></i>
          Test email vendeur
        </button>
        
        <button 
          className="notification-btn download"
          onClick={() => sendTestEmail('download_ready')}
          disabled={loading}
        >
          <i className="fas fa-download"></i>
          Test email téléchargement
        </button>
      </div>
      
      {message && (
        <div className={`notification-message ${message.includes('Erreur') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;