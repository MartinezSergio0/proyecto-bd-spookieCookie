"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([
    { id: 1, name: "Galleta de Chocolate", price: 2.50, stock: 15, category: "Dulce" },
    { id: 2, name: "Galleta de Vainilla", price: 2.00, stock: 20, category: "Dulce" },
    { id: 3, name: "Galleta Espeluznante", price: 3.00, stock: 8, category: "Halloween" }
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: ""
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", stock: "", category: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      setProducts(products.map(product =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: formData.name,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock),
              category: formData.category
            }
          : product
      ));
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category
      };
      setProducts([...products, newProduct]);
    }
    
    setIsModalOpen(false);
    setFormData({ name: "", price: "", stock: "", category: "" });
    setEditingProduct(null);
  };

  return (
    <div className="admin-crud-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>🍪 Panel de Administración - Spooky Cookie</h1>
          <button 
            className="btn-secondary"
            onClick={() => router.push('/')}
          >
            Volver al Inicio
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Productos</h3>
            <p className="stat-number">{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Stock Total</h3>
            <p className="stat-number">
              {products.reduce((sum, product) => sum + product.stock, 0)}
            </p>
          </div>
          <div className="stat-card">
            <h3>Valor Inventario</h3>
            <p className="stat-number">
              ${products.reduce((sum, product) => sum + (product.price * product.stock), 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="action-bar">
          <button className="btn-primary" onClick={handleCreate}>
            + Agregar Producto
          </button>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className="category-tag">{product.category}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingProduct ? 'Editar Producto' : 'Crear Producto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Precio ($)</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Dulce">Dulce</option>
                  <option value="Halloween">Halloween</option>
                  <option value="Navideña">Navideña</option>
                  <option value="Especial">Especial</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}