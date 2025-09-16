// src/services/downloadUtils.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://projetbooklite-backend.onrender.com';
const API_ENDPOINT = `${API_BASE_URL}/api`;

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Télécharge un produit sécurisé depuis le backend
 * @param orderId ID de la commande
 * @param productId ID du produit
 */
export async function downloadProduct(orderId: string, productId: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Utilisateur non connecté : token manquant');
  }

  const response = await fetch(`${API_ENDPOINT}/orders/${orderId}/download/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Erreur lors du téléchargement');
  }

  // Récupère le fichier en Blob
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  // Crée un lien temporaire pour forcer le téléchargement
  const a = document.createElement('a');
  a.href = url;

  // Récupère le nom du fichier depuis le header Content-Disposition si présent
  const disposition = response.headers.get('Content-Disposition');
  let filename = 'downloaded_file';
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match) filename = match[1];
  }
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}
