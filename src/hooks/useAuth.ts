import { useState, useEffect } from 'react';
import { User, AuthResponse } from '../types'; // Assurez-vous que AuthResponse est exporté depuis types.ts
import { apiService } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Toujours vérifier le token avec le backend pour obtenir les vraies données de l'utilisateur
        const userData = await apiService.getProfile();
        setUser(userData);
      } catch (error) {
        // Si le token est invalide ou si une autre erreur se produit, déconnectez l'utilisateur
        console.error("Échec de la vérification de l'authentification:", error);
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = (authData: AuthResponse) => {
    localStorage.setItem('authToken', authData.accessToken);
    setUser(authData.user);
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const deleteUserAccount = async () => {
    // Cette fonction lèvera une erreur en cas d'échec,
    // que le code appelant devra gérer.
    await apiService.deleteAccount();
    await logout(); // Ne se produit qu'en cas de succès de la suppression.
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    isAdmin,
    isAuthenticated,
    login,
    logout,
    deleteUserAccount,
  };
}