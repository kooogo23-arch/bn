/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import './ProductsPage.css';
const ProductsPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Erreur lors du chargement des produits. Veuillez réessayer.');
      } else {
        setError('Une erreur inconnue est survenue lors du chargement des produits.');
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePurchase = async (productId: string) => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
                navigate('/login');
      return;
    }
    
    setLoading(productId);
    setError(null);
    try {
      const product = products.find(p => p._id === productId);
      if (!product) {
        setError('Produit non trouvé.');
        return;
      }
      const order = await apiService.createOrder([{ productId, quantity: 1 }]);
      navigate(`/order/${order._id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Impossible de procéder à l\'achat pour le moment.';
      // Utiliser une alerte pour un retour utilisateur immédiat et non-intrusif
      alert(`Erreur lors de l'achat : ${errorMessage}`);
      // On peut aussi garder l'état d'erreur global si on veut un message persistant
      setError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Nos Produits Digitaux</h1>
          <p className="page-subtitle">Outils professionnels pour accélérer vos projets de modélisation</p>
        </div>
      </section>

      <section className="products-section animated-section">
        <div className="container">
          {error && (
            <div className="text-center py-12 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
              <p>{error}</p>
              <button onClick={loadProducts} className="cta-button mt-4">Réessayer</button>
            </div>
          )}
          
          {!error && products.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun produit disponible</h3>
              <p className="text-gray-500">Les produits seront bientôt ajoutés par l'administrateur.</p>
            </div>
          )}

          {!error && products.length > 0 && (
            <div className="products-grid">
              {products.map(product => {
                const API_URL = import.meta.env.VITE_API_URL || 'https://projetbooklite-backend.onrender.com';
                let imageUrl = '';
                if (product.image) {
                  if (product.image.startsWith('data:') || product.image.startsWith('http')) {
                    imageUrl = product.image;
                  } else {
                    imageUrl = `${API_URL}${product.image.startsWith('/') ? product.image : '/' + product.image}`;
                  }
                }

                return (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#f8f9fa' }}
                        />
                      ) : (
                        // Afficheur de remplacement si aucune image n'est disponible
                        <div style={{
                          width: '100%',
                          height: '200px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          padding: '1rem'
                        }}>
                          {product.title}
                        </div>
                      )}
                    </div>
                    <div className="product-content">
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>

                      <div className="product-price">{product.price || 0}€</div>
                      <div className="product-actions">
                        <button
                          className="cta-button primary"
                          onClick={() => handlePurchase(product._id)}
                          disabled={loading === product._id}
                        >
                          {loading === product._id ? (
                            <><i className="fas fa-spinner fa-spin"></i> Traitement...</>
                          ) : (
                            <>Acheter {product.price || 0}€</>
                          )}
                        </button>
                        <button className="cta-button secondary">
                          <i className="fas fa-eye"></i>
                          Aperçu
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="products-cta animated-section">
        <div className="container">
          <h2>Besoin d'un produit sur-mesure ?</h2>
          <p>Nous développons des solutions personnalisées selon vos besoins spécifiques</p>
          <Link to="/contact" className="cta-button">Discuter de votre projet</Link>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;