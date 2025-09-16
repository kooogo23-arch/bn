/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { User, Order } from '../types';

// Fonction pure déplacée en dehors du composant pour éviter sa redéfinition
const getInitials = (name: string) => {
  if (!name) return '..';
  const names = name.split(' ');
  if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const ProfilePage = () => {
  const { user, isAdmin, loading: authLoading, login, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false); 
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si l'authentification est en cours ou si l'utilisateur n'est pas connecté, on ne fait rien ou on redirige.
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Pré-remplir le formulaire d'édition et charger les commandes
    setEditData({ name: user.name, email: user.email });
    setOrdersLoading(true);
    const loadOrderData = async () => {
      setOrdersError(null);
      try {
        const ordersData = await apiService.getOrders();
        setOrders(ordersData);
      } catch (error) {
        setOrdersError('Impossible de charger l\'historique des commandes.');
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrderData();
  }, [user, authLoading, navigate]);

  const handleLogout = useCallback(async () => {
    // Utiliser la fonction logout du contexte pour une déconnexion propre
    if (logout) {
      await logout();
    }
    navigate('/');
  }, [logout, navigate]);

  const handleUpdateProfile = useCallback(async () => {
    try {
      const updatedUser = await apiService.updateProfile(editData);
      
      // Mettre à jour le contexte d'authentification avec les nouvelles informations.
      // La fonction `login` du hook `useAuth` est réutilisée ici pour mettre à jour l'utilisateur dans le contexte.
      if (updatedUser && login) {
        login({ user: updatedUser, accessToken: localStorage.getItem('authToken') || '' });
      }

      alert("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  }, [editData, login]);

  const handlePasswordChange = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas.');
      setPasswordLoading(false);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      setPasswordLoading(false);
      return;
    }

    try {
      // Cette fonction doit être créée dans apiService et sur le backend
      await apiService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess('Votre mot de passe a été mis à jour avec succès.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError('Une erreur inconnue est survenue.');
      }
    } finally {
      setPasswordLoading(false);
    }
  }, [passwordForm]);

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Efface les erreurs dès que l'utilisateur recommence à taper
    if (passwordError) setPasswordError(null);
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleDeleteAccount = useCallback(async () => {
    try {
      await apiService.deleteAccount();
      if (logout) {
        await logout();
      }
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  }, [logout, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
                  {getInitials(user.name)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-blue-100">{user.email}</p>
                </div>
              </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Profil
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-medium ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Mes commandes ({orders.length})
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Informations personnelles</h2>
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleUpdateProfile}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      id="profile-name"
                      value={isEditing ? editData.name : user?.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      id="profile-email"
                      value={isEditing ? editData.email : user?.email || ''}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-role" className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                    <input
                      type="text"
                      id="profile-role"
                      value={user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-member-since" className="block text-sm font-medium text-gray-700 mb-2">Membre depuis</label>
                    <input
                      type="text"
                      id="profile-member-since"
                      value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
                
                {/* Section de changement de mot de passe */}
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    {passwordError && <div className="p-3 bg-red-100 text-red-700 rounded-md">{passwordError}</div>}
                    {passwordSuccess && <div className="p-3 bg-green-100 text-green-700 rounded-md">{passwordSuccess}</div>}
                    
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {passwordLoading ? 'Mise à jour...' : 'Changer le mot de passe'}
                    </button>
                  </form>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Zone de danger</h3>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {ordersError && (
                  <div className="text-center py-8 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    <p>{ordersError}</p>
                  </div>
                )}
                {!ordersError && orders.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Aucune commande pour le moment</p>
                    <button
                      onClick={() => navigate('/produits')}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Découvrir nos produits
                    </button>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <button
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="font-semibold text-blue-600 hover:text-blue-800 text-left"
                          >
                            Commande #{order._id.slice(-8)}
                          </button>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${ 
                          order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'paid' ? 'Payée' :
                           order.status === 'pending' ? 'En attente' : order.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{typeof item.product === 'object' ? item.product.title : 'Produit'}</span>
                            <span>{item.quantity} × {item.price}€</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{order.totalAmount}€</span>
                          <button
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Voir détails →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions de la page */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col sm:flex-row justify-end items-center gap-4">
          {isAdmin && (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition-colors font-medium"
            >
              <i className="fas fa-tachometer-alt mr-2"></i>
              Tableau de bord
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors font-medium"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex-1"
              >
                Oui, supprimer
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 flex-1"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
