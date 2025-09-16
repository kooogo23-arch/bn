import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Order, Product, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import NotificationCenter from '../components/NotificationCenter';
import './DashboardPage.css';
import ImageInput from '../components/ImageUpload.tsx';

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
}

interface DashboardOrder extends Omit<Order, 'items' | 'user'> {
  productName: string;
  buyerEmail: string;
}

const DashboardPage = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [productForm, setProductForm] = useState({
    title: '', author: '', description: '', price: '', category: '', stock: '',
      imageUrl: ''
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  // Local files (PDF) state
  const [localFiles, setLocalFiles] = useState<Array<{ _id: string; fileId: string; name: string; path: string }>>([]);
  const [pdfToUpload, setPdfToUpload] = useState<File | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const maybeLoad = async () => {
      if (activeTab === 'files') {
        try {
          const list = await apiService.getLocalFiles();
          setLocalFiles(list);
        } catch (e: any) {
          console.error(e);
        }
      }
    };
    maybeLoad();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, ordersData, productsData, usersData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getDashboardOrders(),
        apiService.getProducts(),
        apiService.getUsers()
      ]);
      
      const dashboardOrders: DashboardOrder[] = ordersData.map((order: Order) => {
        const { items, user, ...rest } = order;
        return {
          ...rest,
          productName: items.map(item => (item && typeof item.product === 'object' && item.product ? (item.product as Product).title : 'N/A')).join(', '),
          buyerEmail: (user && typeof user === 'object' && (user as User).email) ? (user as User).email : 'N/A',
        };
      });

      setStats(statsData);
      setOrders(dashboardOrders);
      setProducts(productsData);
      setUsers(usersData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Erreur lors du chargement des données du dashboard.");
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({ title: '', author: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
    setProductImage(null);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imagePayload = productForm.imageUrl || null;
      if (productImage) {
        const reader = new FileReader();
        imagePayload = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsDataURL(productImage);
        });
      }

      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        image: imagePayload
      };

      if (editingProduct) {
        // Logique de mise à jour
        await apiService.updateProduct(editingProduct._id, productData);
      } else {
        // Logique de création
        await apiService.createProductJSON(productData);
      }

      closeProductModal();
      loadDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await apiService.deleteUser(userId);
        loadDashboardData();
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      await apiService.updateUserRole(userId, role);
      loadDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      loadDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleSendDeliveryEmail = async (orderId: string) => {
    try {
      await apiService.sendDeliveryEmail(orderId);
      alert('Email de livraison envoyé !');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        await apiService.deleteOrder(orderId);
        loadDashboardData();
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      author: product.author,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),imageUrl: product.image || ''
    });
    setProductImage(null);
    setShowProductModal(true);
  };

  const handleToggleProduct = async (productId: string, isActive: boolean) => {
    try {
      await apiService.updateProduct(productId, { isActive });
      loadDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await apiService.deleteProduct(productId);
        loadDashboardData();
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="access-denied">
        <div className="container">
          <h1>Connexion requise</h1>
          <p>Vous devez être connecté pour accéder au dashboard.</p>
          <Link to="/login" className="cta-button">Se connecter</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <div className="container">
          <h1>Accès refusé</h1>
          <p>Seuls les administrateurs peuvent accéder au dashboard.</p>
          <Link to="/" className="cta-button">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        
        {error && (
            <div className="text-center py-12 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
              <p>{error}</p>
              <button onClick={loadDashboardData} className="cta-button mt-4">Réessayer</button>
            </div>
        )}

        {!error && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-content">
                  <h3>Ventes totales</h3>
                  <p className="stat-number">{stats?.totalSales || 0}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-euro-sign"></i>
                </div>
                <div className="stat-content">
                  <h3>Revenus</h3>
                  <p className="stat-number">{stats?.totalRevenue || 0}€</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-content">
                  <h3>Commandes</h3>
                  <p className="stat-number">{stats?.totalOrders || 0}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-box"></i>
                </div>
                <div className="stat-content">
                  <h3>Produits</h3>
                  <p className="stat-number">{stats?.totalProducts || 0}</p>
                </div>
              </div>
            </div>

            <NotificationCenter />
            
            {/* Navigation par onglets */}
            <div className="dashboard-tabs" style={{marginBottom: '2rem'}}>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 mr-2 rounded ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Vue d'ensemble
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 mr-2 rounded ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Produits
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 mr-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Utilisateurs
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 mr-2 rounded ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Commandes
              </button>
              <button 
                onClick={() => setActiveTab('files')}
                className={`px-4 py-2 mr-2 rounded ${activeTab === 'files' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Fichiers (ZIP)
              </button>
            </div>
            
            {activeTab === 'products' && (
              <div className="products-section">
                  <div className="section-header">
                     <h2>Gestion des produits</h2>
                     <button onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                       className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                         >
                       <i className="fas fa-plus mr-2"></i>
                        Ajouter un produit
                     </button>
                  </div>

                <div className="products-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                {products.map(product => {
                  const resolveImageUrl = (img?: string | null) => {
                    if (!img) return '';
                    if (img.startsWith('data:')) return img;
                    if (img.startsWith('http://') || img.startsWith('https://')) return img;
                    if (img.startsWith('/uploads')) {
                      const base = (import.meta as any).env?.VITE_API_URL || 'https://projetbooklite-backend.onrender.com';
                      return `${base}${img}`;
                    }
                    return img; // fallback
                  };
                  const imgSrc = resolveImageUrl(product.image as unknown as string);
                  return (
                  <div key={product._id} className="bg-white p-4 rounded-lg shadow border">
                    {imgSrc ? (
                      <img
                         src={imgSrc} 
                         alt={product.title} 
                          style={{width: '100%', height: '200px', objectFit: 'cover'}} 
                      />
                    ) : (
                      <div 
                        className="w-full h-32 rounded mb-3"
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          padding: '0.5rem'
                        }}
                      >
                        {product.title}
                      </div>
                    )}
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.author}</p>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-lg font-bold text-blue-600">{product.price}€</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        <i className="fas fa-edit mr-1"></i>Modifier
                      </button>
                      <button
                        onClick={() => handleToggleProduct(product._id, !product.isActive)}
                        className={`flex-1 px-3 py-1 rounded text-sm ${
                          product.isActive 
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        <i className={`fas ${product.isActive ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                        {product.isActive ? 'Masquer' : 'Afficher'}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                    {/* Gestion des fichiers Google Drive rattachés au produit */}
                    <div className="border-t pt-3 mt-3">
                      <h4 className="font-semibold text-sm mb-2">Fichiers attachés</h4>
                      {Array.isArray(product.files) && product.files.length > 0 ? (
                        <ul className="mb-3 space-y-1">
                          {product.files.map((f) => (
                            <li key={f.fileId} className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                              <span className="truncate" title={f.fileName || f.fileId}>{f.fileName || f.fileId}</span>
                              <button
                                className="text-red-600 hover:text-red-800 ml-2"
                                onClick={async () => {
                                  try {
                                    await apiService.detachProductFile(product._id, f.fileId);
                                    await loadDashboardData();
                                  } catch (e: any) {
                                    alert(e?.message || 'Erreur lors du détachement');
                                  }
                                }}
                                title="Détacher ce fichier"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500 mb-3">Aucun fichier attaché.</p>
                      )}

                      <LocalFilesAttachForm productId={product._id} onAttached={loadDashboardData} />
                   </div>
                  </div>
                  )
                })}
              </div>
            </div>
            )}

          {activeTab === 'users' && (
           <div className="users-section">
            <h2 className="text-xl font-bold mb-4">Gestion des utilisateurs</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map(u => (
                        <tr key={u._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select 
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                              className="border rounded px-2 py-1"
                            >
                              <option value="user">Utilisateur</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2 className="text-xl font-bold mb-4">Gestion des commandes</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produits</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                            #{order._id.slice(-8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.buyerEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{order.productName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                            {order.totalAmount}€
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-sm border ${
                                order.status === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                              }`}
                            >
                              <option value="pending">En attente</option>
                              <option value="paid">Payée</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrée</option>
                              <option value="cancelled">Annulée</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => window.open(`/order/${order._id}`, '_blank')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Voir détails"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleSendDeliveryEmail(order._id)}
                              className="text-green-600 hover:text-green-800"
                              title="Envoyer email de livraison"
                              disabled={order.status !== 'paid'}
                            >
                              <i className="fas fa-envelope"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Supprimer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'files' && (
              <div className="files-section">
                <h2 className="text-xl font-bold mb-4">Gestion des fichiers (ZIP locaux)</h2>
                <div className="bg-white p-4 rounded-lg shadow border mb-6">
                  <label className="block text-sm font-medium mb-2">Téléverser un fichier ZIP</label>
                  <input
                    type="file"
                    accept=".zip,application/zip,application/x-zip-compressed"
                    onChange={(e) => setPdfToUpload(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border rounded-md mb-3"
                  />
                  <button
                    onClick={async () => {
                      if (!pdfToUpload) { alert('Veuillez sélectionner un fichier ZIP (.zip).'); return; }
                      setUploadingPdf(true);
                      try {
                        const created = await apiService.uploadLocalFile(pdfToUpload);
                        setPdfToUpload(null);
                        const list = await apiService.getLocalFiles();
                        setLocalFiles(list);
                        alert(`Fichier ajouté: ${created.name}`);
                      } catch (e: any) {
                        alert(e?.message || "Erreur lors de l'upload du ZIP");
                      } finally {
                        setUploadingPdf(false);
                      }
                    }}
                    disabled={uploadingPdf}
                    className={`px-4 py-2 rounded-md text-white ${uploadingPdf ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {uploadingPdf ? 'Téléversement...' : 'Ajouter le ZIP'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Seuls les fichiers ZIP (.zip) sont acceptés. Taille max: 200MB.</p>
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b font-semibold">Fichiers enregistrés</div>
                  {localFiles.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">Aucun fichier pour le moment.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 uppercase">
                        <tr>
                          <th className="px-4 py-2 text-left">Nom</th>
                          <th className="px-4 py-2 text-left">fileId</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {localFiles.map((f) => (
                          <tr key={f._id} className="border-b">
                            <td className="px-4 py-2 truncate" title={f.name}>{f.name}</td>
                            <td className="px-4 py-2 font-mono text-xs truncate" title={f.fileId}>{f.fileId}</td>
                            <td className="px-4 py-2 space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={async () => {
                                  try {
                                    const link = await apiService.generateDriveLink(f.fileId);
                                    await navigator.clipboard.writeText(link.downloadUrl);
                                    alert('Lien de téléchargement copié dans le presse-papiers.');
                                  } catch (e: any) {
                                    alert(e?.message || 'Erreur lors de la génération du lien');
                                  }
                                }}
                              >
                                Générer lien
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(f.fileId);
                                    alert('fileId copié.');
                                  } catch {}
                                }}
                              >
                                Copier fileId
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Commandes récentes</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-2">Produit</th>
                          <th className="px-4 py-2">Client</th>
                          <th className="px-4 py-2">Montant</th>
                          <th className="px-4 py-2">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order._id} className="bg-white border-b">
                            <td className="px-4 py-2 truncate">{order.productName}</td>
                            <td className="px-4 py-2 truncate">{order.buyerEmail}</td>
                            <td className="px-4 py-2">{order.totalAmount}€</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.status === 'paid' ? 'Payé' : 'En attente'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Utilisateurs récents</h2>
                  <ul className="divide-y divide-gray-200">
                    {users.slice(0, 5).map(user => (
                      <li key={user._id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
                )}
           </>
        )}
      {/* Modal d'ajout de produit */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" >
            <h3 className="text-lg font-semibold mb-4">{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Auteur</label>
                <input
                  type="text"
                  value={productForm.author}
                  onChange={(e) => setProductForm({...productForm, author: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (€)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                  <ImageInput onChange={(url) => setProductForm({...productForm, image: url})} />


              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1"
                >
                  {editingProduct ? 'Sauvegarder' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 flex-1"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );};

// --- Sous-composant: formulaire d'attache de fichiers locaux ---
const LocalFilesAttachForm = ({ productId, onAttached }: { productId: string; onAttached: () => void }) => {
  const [linkInput, setLinkInput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAttachViaLink = async () => {
    const input = linkInput.trim();
    if (!input) {
      alert('Collez un lien ou un jeton (token) de téléchargement.');
      return;
    }
    setLoading(true);
    try {
      await apiService.attachProductFiles(productId, [input]);
      setLinkInput('');
      onAttached();
    } catch (e: any) {
      alert(e?.message || "Erreur lors de l'attache via lien/token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-3 rounded">
      <div className="mt-1">
        <label className="block text-xs font-medium mb-1">Collez un lien/token de téléchargement</label>
        <p className="text-[11px] text-gray-500 mb-1">Exemple: http://localhost:5000/api/download/xxxxxxxx...</p>
        <input
          type="text"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mb-2"
          placeholder="Lien complet ou token (64 hex)"
        />
        <button
          onClick={handleAttachViaLink}
          disabled={loading || !linkInput.trim()}
          className={`px-3 py-1 rounded text-sm text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Ajout...' : 'Attacher'}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;