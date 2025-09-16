// Configuration API pour le backend BookLite

// Importez le type Product depuis son fichier de définition
import axios, { type AxiosProgressEvent } from 'axios';
import type { Product, User, Order } from '../types'; // Ajustez le chemin selon l'emplacement réel du type

// Utilisez le type AuthResponse centralisé
import type { AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://projetbooklite-backend.onrender.com';
const API_ENDPOINT = `${API_BASE_URL}/api`;

class ApiService {
  private getHeaders(includeAuth = true) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = localStorage.getItem('authToken');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Auth
  async register(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_ENDPOINT}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur de connexion');
    }
    return response.json();
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: this.getHeaders(false),
      });
      const data = await response.json();
      if (!response.ok) {
        // If refresh failed, clear any stale access token and return null
        localStorage.removeItem('authToken');
        return null;
      }
      if (data && data.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
        return data.accessToken as string;
      }
      return null;
    } catch {
      // Network or parsing error
      return null;
    }
  }

  // Centralized helper to call authenticated endpoints with automatic refresh on 401
  private async fetchAuthed(url: string, init: RequestInit = {}, retry = true): Promise<Response> {
    // Merge headers and drop JSON content-type if sending FormData so browser can set proper boundary
    const firstHeaders = new Headers(init.headers);
    for (const [key, value] of Object.entries(this.getHeaders())) {
      firstHeaders.set(key, value);
    }
    if (typeof FormData !== 'undefined' && init.body instanceof FormData) {
      firstHeaders.delete('Content-Type');
    }
    const response = await fetch(url, {
      ...init,
      headers: firstHeaders,
      credentials: init.credentials || 'same-origin',
    });

    if (response.status !== 401) {
      return response;
    }

    // Try to read error to identify token_expired, but refresh even if not specified (best effort)
    try { await response.clone().json(); } catch { /* empty */ }

    if (!retry) return response;

    const newToken = await this.refreshAccessToken();
    if (!newToken) {
      return response;
    }
    // Retry once with new token
    const retryHeaders = new Headers(init.headers);
    for (const [key, value] of Object.entries(this.getHeaders())) {
      retryHeaders.set(key, value);
    }
    if (typeof FormData !== 'undefined' && init.body instanceof FormData) {
      retryHeaders.delete('Content-Type');
    }
    return await fetch(url, {
      ...init,
      headers: retryHeaders,
      credentials: init.credentials || 'same-origin',
    });
  }

  async getProfile(): Promise<User> {
    // First attempt with current access token
    let response = await fetch(`${API_ENDPOINT}/auth/me`, {
      headers: this.getHeaders(),
    });
    if (response.ok) {
      return response.json();
    }

    // Read error to decide next steps
    let data: { message?: string } = {};
    try { data = await response.json(); } catch {/* empty */ }

    // If token is revoked, surface a clear error and clear local token
    if (response.status === 401 && data?.message && data.message.includes('Token révoqué')) {
      localStorage.removeItem('authToken');
      throw new Error('Token révoqué. Veuillez vous reconnecter.');
    }

    // If token is invalid/expired, try to refresh and retry once
    if (response.status === 401) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        response = await fetch(`${API_ENDPOINT}/auth/me`, {
          headers: this.getHeaders(),
        });
        if (response.ok) {
          return response.json();
        }
        try { data = await response.json(); } catch {/* empty */ }
      }
    }

    // Fallback: throw the error message from server or default message
    throw new Error((data && data.message) || 'Erreur lors de la récupération du profil');
  }

  async logout(): Promise<void> {
    // Cette méthode appelle le backend pour invalider les jetons côté serveur.
    // La suppression du token local et la mise à jour de l'état se font dans le hook useAuth.
    try {
      await fetch(`${API_ENDPOINT}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
      });
    } catch (error) {
      console.error("L'appel de déconnexion au backend a échoué, mais la déconnexion locale va continuer.", error);
    }
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_ENDPOINT}/products`, {
      headers: this.getHeaders(false),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de récupération des produits');
    }
    return data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_ENDPOINT}/products/${id}`, {
      headers: this.getHeaders(false),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de récupération du produit');
    }
    return data;
  }

  async createProduct(productData: FormData): Promise<Product> {
    const headers = this.getHeaders();
    delete headers['Content-Type']; // Let browser set Content-Type for FormData

    const response = await fetch(`${API_ENDPOINT}/products`, {
      method: 'POST',
      headers,
      body: productData,
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de création');
    }
    
    return data;
  }

  async createProductJSON(productData: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_ENDPOINT}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de création');
    }
    
    return data;
  }

  async uploadImage(
    file: File,
    // Le suivi de la progression n'est pas supporté avec fetch, mais on garde le paramètre pour la compatibilité
    _onUploadProgress: (progressEvent: AxiosProgressEvent) => void
  ): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    // Utilisation de fetchAuthed pour la cohérence et la robustesse avec l'authentification.
    // Note : la progression de l'upload n'est pas supportée nativement par fetch.
    const response = await this.fetchAuthed(`${API_ENDPOINT}/local-files`, {
      method: 'POST',
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      throw new Error(responseData.message || "L'upload a échoué");
    }

    const path = responseData.data.path;
    const fullUrl = `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;

    return { url: fullUrl };
  }


  // Users management
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_ENDPOINT}/users`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de récupération des utilisateurs');
    }
    return data;
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur de suppression');
    }
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const response = await fetch(`${API_ENDPOINT}/users/${id}/role`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ role }),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de mise à jour');
    }
    
    return data;
  }

  // Orders management
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    try {
      const response = await fetch(`${API_ENDPOINT}/orders/${id}/status`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de mise à jour');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      throw error;
    }
  }

  async sendDeliveryEmail(orderId: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/orders/${orderId}/delivery`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur d\'envoi');
    }
  }

  async deleteOrder(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/orders/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur de suppression');
    }
  }

  // Download and export
  async getDownloadLink(orderId: string, productId: string): Promise<string> {
    const response = await fetch(`${API_ENDPOINT}/orders/${orderId}/download/${productId}`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de téléchargement');
    }
    
    // Support both legacy single-file and new multi-file responses
    if (Array.isArray((data as any).downloads) && (data as any).downloads.length > 0) {
      const first = (data as any).downloads[0];
      if (first && first.downloadUrl) return first.downloadUrl as string;
    }
    if (data.downloadUrl) return data.downloadUrl as string;

    throw new Error('Aucun lien de téléchargement disponible.');
  }

  async exportReceipt(orderId: string): Promise<Blob> {
    const response = await fetch(`${API_ENDPOINT}/orders/${orderId}/receipt`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur d\'export');
    }
    
    return response.blob();
  }

  async emailReceipt(orderId: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/orders/${orderId}/email-receipt`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur d\'envoi');
    }
  }

  // Product management
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_ENDPOINT}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Erreur de mise à jour');
    }
    
    return result;
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur de suppression');
    }
  }

  // Orders
  async createOrder(items: { productId: string; quantity: number }[], shippingAddress?: Order['shippingAddress']): Promise<Order> {
    const response = await fetch(`${API_ENDPOINT}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ items, shippingAddress }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création de la commande');
    }
    return data;
  }

  async processPayment(orderId: string, paymentData: Record<string, unknown>) {
    const response = await fetch(`${API_ENDPOINT}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du traitement du paiement');
    }
    return data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_ENDPOINT}/orders`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de récupération des commandes');
    }
    return data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_ENDPOINT}/orders/${id}`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de récupération de la commande');
    }
    return data;
  }

  // Dashboard
  async getDashboardStats() {
    const response = await fetch(`${API_ENDPOINT}/dashboard/stats`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de récupération des statistiques');
    }
    return data;
  }

  async getDashboardOrders(): Promise<Order[]> {
    const response = await fetch(`${API_ENDPOINT}/dashboard/orders`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de récupération des commandes');
    }
    return data;
  }

  // Email notifications
  async sendTestEmail(type: string, orderId?: string) {
    const response = await fetch(`${API_ENDPOINT}/notifications/test`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ type, orderId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'envoi de l\'email de test');
    }
    return data;
  }

  async updateProfile(userData: { name: string; email: string }): Promise<User> {
    const response = await fetch(`${API_ENDPOINT}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de mise à jour');
    }
    
    return data;
  }

  async deleteAccount(): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/auth/account`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur de suppression');
    }
  }

    // --- Admin Drive management ---
  async getDriveFiles() {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/files`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Erreur de récupération des fichiers Drive');
    }
    return data.data as Array<{ id: string; name: string; mimeType: string; size?: string; createdTime?: string; modifiedTime?: string }>;
  }

  async checkDriveFile(fileId: string) {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/files/${encodeURIComponent(fileId)}/check`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Fichier introuvable ou non accessible');
    }
    return data.data as { id: string; name: string; mimeType: string; size?: string; owners?: Array<{displayName?: string; emailAddress?: string}> };
  }

  async generateDriveLink(fileId: string, options?: { expiryDays?: number; maxDownloads?: number }) {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/generate-link/${fileId}`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Erreur de génération du lien');
    }
    return data.data as { token: string; downloadUrl: string; expires: string; maxDownloads: number };
  }

  async getDriveLinks() {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/links`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Erreur de récupération des liens');
    }
    return data.data as Array<{ token: string; fileId: string; fileName: string; expires: string; maxDownloads: number; currentDownloads: number; createdAt: string }>;
  }

  async resetDriveLink(token: string) {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/links/${encodeURIComponent(token)}/reset`, {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Erreur de réinitialisation du lien");
    }
    return data;
  }

  async revokeDriveLink(token: string) {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/revoke-link/${encodeURIComponent(token)}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de révocation du lien');
    }
    return data;
  }

  // Local files (stored on backend)
  async uploadLocalFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.fetchAuthed(`${API_ENDPOINT}/local-files`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de l\'upload du fichier');
    }
    return data.data as { _id: string; fileId: string; name: string; path: string };
  }

  async getLocalFiles() {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/local-files`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors du chargement des fichiers');
    }
    return data.data as Array<{ _id: string; fileId: string; name: string; path: string }>;
  }

  async attachProductFiles(productId: string, fileIds: string[]) {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/products/${productId}/files`, {
      method: 'POST',
      body: JSON.stringify({ fileIds }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'attache des fichiers');
    }
    return data as Product;
  }

  async detachProductFile(productId: string, fileId: string) {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/products/${productId}/files/${fileId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du détachement du fichier');
    }
    return data as Product;
  }
  async sendContactForm(formData: { name: string; email: string; message: string; subject: string; }): Promise<{ message: string }> {
    const response = await fetch(`${API_ENDPOINT}/contact`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'envoi du message');
    }
    return data;
  }

  // Version checking for updates
  async getBackendVersion() {
    const response = await fetch(`${API_ENDPOINT}/version`, {
      headers: this.getHeaders(false),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de récupération de la version');
    }
    return data;
  }

  /**
   * Envoie une demande de réinitialisation de mot de passe.
   */
  async forgotPassword(data: { email: string }): Promise<any> {
    const response = await fetch(`${API_ENDPOINT}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Erreur lors de la demande de réinitialisation.');
    }
    return responseData;
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur avec un jeton.
   */
  async resetPassword(data: { token: string; newPassword: string }): Promise<any> {
    const response = await fetch(`${API_ENDPOINT}/auth/reset-password`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Erreur lors de la réinitialisation du mot de passe.');
    }
    return responseData;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    const response = await this.fetchAuthed(`${API_ENDPOINT}/users/change-password`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors du changement de mot de passe.');
    }
  }
}
 
export const apiService = new ApiService();