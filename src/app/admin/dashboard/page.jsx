"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function AdminDashboardPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    ingredients: "",
    image: ""
  });
  const router = useRouter();

  // Cargar productos al iniciar
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/productos");
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setMenuItems(data.productos || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
      alert("No se pudieron cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      ingredients: "",
      image: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description,
      ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(", ") : item.ingredients,
      image: item.image
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const res = await fetch("/api/admin/productos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto: id })
      });

      if (!res.ok) throw new Error("Error al eliminar producto");
      await loadMenuItems(); // recargar productos
      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("Error al eliminar el producto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ingredientesArray = formData.ingredients
      .split(",")        // separa por comas
      .map(i => i.trim()) // elimina espacios extra
      .filter(i => i);    // elimina vacíos

    const body = {
      nombre: formData.name,
      descripcion: formData.description,
      precio_base: parseFloat(formData.price),
      tipo: formData.category,
      ingredientes: ingredientesArray, 
      imagen: formData.image
    };

    try {
      if (editingItem) {
        // EDITAR producto existente
        const res = await fetch("/api/admin/productos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_producto: editingItem.id,
            ...body
          })
        });
        if (!res.ok) throw new Error("Error al actualizar producto");
        alert("Producto actualizado correctamente");
      } else {
        // CREAR nuevo producto
        const res = await fetch("/api/admin/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error("Error al crear producto");
        alert("Producto creado correctamente");
      }

      setIsModalOpen(false);
      await loadMenuItems();
      setEditingItem(null);
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("Error al guardar el producto");
    }
  };


  if (isLoading) {
    return (
      <div className="admin-crud-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

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
        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Productos</h3>
            <p className="stat-number">{menuItems.length}</p>
          </div>
          <div className="stat-card">
            <h3>Precio Promedio</h3>
            <p className="stat-number">
              ${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length || 0).toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <h3>Categorías</h3>
            <p className="stat-number">
              {new Set(menuItems.map(item => item.category)).size}
            </p>
          </div>
        </div>

        {/* Barra de acciones */}
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

        {/* Tabla de productos */}
        <div className="table-container">
          {menuItems.length === 0 ? (
            <div className="empty-state">
              <h3>No hay productos registrados</h3>
              <p>Comienza agregando tu primer producto</p>
            </div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Ingredientes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="product-image-cell">
                        <Image
                          src={item.image} 
                          alt={item.name} 
                          width={100}
                          height={100}
                          className="product-thumbnail"
                          onError={(e) => {
                            e.target.src = "/default-cookie.png";
                          }}
                        />
                      </div>
                    </td>
                    <td><strong>{item.name}</strong></td>
                    <td><span className="price-tag">${item.price.toFixed(2)}</span></td>
                    <td><span className={`category-tag ${item.category}`}>{item.category}</span></td>
                    <td><div className="description-cell">{item.description}</div></td>
                    <td><div className="ingredients-cell">
                      {Array.isArray(item.ingredients) ? item.ingredients.slice(0, 2).join(", ") : item.ingredients}
                      {Array.isArray(item.ingredients) && item.ingredients.length > 2 && "..."}
                    </div></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal para crear/editar */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <h2>{editingItem ? 'Editar Producto' : 'Crear Producto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio ($) *</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="clasicas">Clásicas</option>
                    <option value="especiales">Especiales</option>
                    <option value="halloween">Halloween</option>
                    <option value="navidenas">Navideñas</option>
                    <option value="veganas">Veganas</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>URL de la Imagen *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ingredientes *</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  required
                />
                <small>Separar con comas (,)</small>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Actualizar' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
