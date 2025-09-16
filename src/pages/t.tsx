import React, { useState, useEffect } from "react";

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "products" | "users" | "orders" | "files"
  >("products");
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  // Exemple : chargement des données (tu adapteras avec ton backend déjà branché)
  useEffect(() => {
    if (activeTab === "products") {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error(err));
    }

    if (activeTab === "users") {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error(err));
    }

    if (activeTab === "orders") {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error(err));
    }

    if (activeTab === "files") {
      fetch("/api/files")
        .then((res) => res.json())
        .then((data) => setFiles(data))
        .catch((err) => console.error(err));
    }
  }, [activeTab]);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      {/* Onglets */}
      <div className="tabs">
        <button onClick={() => setActiveTab("products")}>Produits</button>
        <button onClick={() => setActiveTab("users")}>Utilisateurs</button>
        <button onClick={() => setActiveTab("orders")}>Commandes</button>
        <button onClick={() => setActiveTab("files")}>Fichiers</button>
      </div>

      {/* PRODUITS */}
      {activeTab === "products" && (
        <div className="products-section">
          <h2>Produits</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <h3>{product.name}</h3>
                <p>Prix : {product.price} GNF</p>
                <p>Stock : {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UTILISATEURS */}
      {activeTab === "users" && (
        <div className="users-section">
          <h2>Utilisateurs</h2>
          <div className="users-grid">
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <h3>{user.username}</h3>
                <p>Email : {user.email}</p>
                <p>Rôle : {user.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMANDES */}
      {activeTab === "orders" && (
        <div className="orders-section">
          <h2>Commandes</h2>
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <h3>Commande #{order._id}</h3>
                <p>Utilisateur : {order.userId}</p>
                <p>Total : {order.total} GNF</p>
                <p>Status : {order.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FICHIERS */}
      {activeTab === "files" && (
        <div className="files-section">
          <h2>Fichiers</h2>
          <div className="files-grid">
            {files.map((file) => (
              <div key={file._id} className="file-card">
                <h3>{file.filename}</h3>
                <p>Taille : {file.size} Ko</p>
                <a href={file.downloadUrl} target="_blank" rel="noreferrer">
                  Télécharger
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
