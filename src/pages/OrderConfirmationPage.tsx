import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Order, OrderItem } from '../types';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Effet pour le chargement initial de la commande
  useEffect(() => {
    const initialLoad = async () => {
      if (!orderId) return;
      try {
        const fetchedOrder = await apiService.getOrder(orderId);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Erreur lors du chargement de la commande:", error);
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, [orderId, navigate]);

  // Effet pour le rafraîchissement automatique si la commande est en attente
  useEffect(() => {
    if (order?.status === 'pending') {
      const intervalId = setInterval(async () => {
        if (!orderId) return;
        try {
          const updatedOrder = await apiService.getOrder(orderId);
          setOrder(updatedOrder);
        } catch (err) {
          console.error("Erreur pendant le rafraîchissement:", err);
        }
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [order, orderId]);

  // Télécharger un produit
  const handleDownload = async (productId: string) => {
    try {
      const downloadUrl = await apiService.getDownloadLink(orderId!, productId);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || 'Erreur de téléchargement');
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  // Exporter le reçu PDF
  const handleExportReceipt = async () => {
    try {
      const receipt = await apiService.exportReceipt(orderId!);
      const blob = new Blob([receipt], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recu-${order?._id?.slice(-8)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "Erreur d'export");
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  // Envoyer le reçu par email
  const handleEmailReceipt = async () => {
    try {
      await apiService.emailReceipt(orderId!);
      alert('Reçu envoyé par email !');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "Erreur d'envoi");
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Commande enregistrée</h1>
            <p className="text-gray-600">#{order?._id?.slice(-8) || 'N/A'}</p>
          </div>

          {/* Résumé commande */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="font-semibold mb-4">Résumé de votre commande</h2>
            <div className="space-y-2">
              {order?.items?.map((item: OrderItem, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{typeof item.product === 'object' ? item.product.title : 'Produit'} × {item.quantity}</span>
                  <span>{item.price}€</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{order?.totalAmount}€</span>
              </div>
            </div>
          </div>

          {/* Instructions paiement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Instructions de paiement</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Montant:</strong> {order?.totalAmount}€</p>
              <p><strong>Méthode:</strong> Orange Money </p>
              <p><strong>Destinataire:</strong> booklite.org</p>
              <p><strong>Numéro:</strong> +224 627 70 65 64 </p>
            </div>
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-sm font-medium">Étapes:</p>
              <ol className="text-sm text-gray-600 mt-1 space-y-1">
                <li>1. Composez #144# (Orange) </li>
                <li>2. Envoyez {order?.totalAmount}€ au +224 627 70 65 64</li>
                <li>3. Envoyer le SMS de confirmation ainsi que votre numéro de commande. Ex : Commande enregistrée #{order?._id?.slice(-8)}</li>
              </ol>
            </div>
          </div>

          {/* Produits téléchargeables */}
          {order?.status === 'paid' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <i className="fas fa-check-circle text-green-600 text-xl mr-3"></i>
                <div>
                  <p className="font-semibold text-green-800">Paiement confirmé !</p>
                  <p className="text-green-700 text-sm">Vos produits sont prêts au téléchargement</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-green-800">Liens de téléchargement :</h3>
                {order.items.map((item: OrderItem) => {
                  const productId = typeof item.product === 'object' ? item.product._id : item.productId;
                  const productTitle = typeof item.product === 'object' ? item.product.title : 'Produit';

                  return (
                    <div key={productId} className="bg-white rounded-lg p-4 border border-green-200 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{productTitle}</p>
                        <p className="text-sm text-gray-600">Valide 7 jours - 3 téléchargements max</p>
                      </div>
                      <button
                        onClick={() => handleDownload(productId)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                      >
                        Télécharger
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-green-200">
                <button
                  onClick={handleExportReceipt}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm mr-3"
                >
                  <i className="fas fa-file-pdf mr-2"></i>
                  Exporter le reçu PDF
                </button>
                <button
                  onClick={handleEmailReceipt}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Envoyer par email
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <i className="fas fa-clock text-yellow-600 mt-1 mr-3"></i>
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">En attente de paiement</p>
                  <p className="text-yellow-700">Vos produits seront livrés par email dans les 2h suivant la confirmation du paiement.</p>
                </div>
              </div>
            </div>
          )}

          {/* Bouton retour */}
          <div className="text-center space-y-4">
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Voir mes commandes
            </button>
            <p className="text-sm text-gray-500">
              Besoin d'aide ? Contactez-nous à contact@booklite.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
