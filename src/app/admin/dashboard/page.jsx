"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function AdminDashboardPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products"); // "products" o "orders"
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    ingredients: "",
    image: ""
  });
  const router = useRouter();

  // Cargar productos y pedidos al iniciar
  useEffect(() => {
    loadMenuItems();
    loadOrders();
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

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/pedidos");
      if (!res.ok) throw new Error("Error al cargar pedidos");
      const data = await res.json();
      setOrders(data.pedidos || []);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      alert("No se pudieron cargar los pedidos");
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
      await loadMenuItems();
      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("Error al eliminar el producto");
    }
  };

  // Función para cambiar el estado del pedido
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/admin/pedidos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_pedido: orderId,
          estado: newStatus
        })
      });

      if (!res.ok) throw new Error("Error al actualizar estado del pedido");
      
      await loadOrders(); // Recargar pedidos
      alert("Estado del pedido actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando pedido:", error);
      alert("Error al actualizar el estado del pedido");
    }
  };

  // Función para cambiar el estado de pago
  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const res = await fetch("/api/admin/pedidos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_pedido: orderId,
          estado_pago: newPaymentStatus
        })
      });

      if (!res.ok) throw new Error("Error al actualizar estado de pago");
      
      await loadOrders();
      alert("Estado de pago actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando pago:", error);
      alert("Error al actualizar el estado de pago");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ingredientesArray = formData.ingredients
      .split(",")
      .map(i => i.trim())
      .filter(i => i);

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

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener clase CSS según estado
  const getStatusClass = (status) => {
    const statusMap = {
      'pendiente': 'status-pending',
      'confirmado': 'status-confirmed',
      'preparacion': 'status-preparation',
      'listo': 'status-ready',
      'entregado': 'status-delivered',
      'cancelado': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  const getPaymentStatusClass = (status) => {
    const statusMap = {
      'pendiente': 'payment-pending',
      'pagado': 'payment-paid',
      'rechazado': 'payment-rejected'
    };
    return statusMap[status] || 'payment-pending';
  };

  if (isLoading) {
    return (
      <div className="admin-crud-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
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

      {/* Navegación por pestañas */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Gestión de Productos
        </button>
        <button 
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Gestión de Pedidos ({orders.length})
        </button>
      </div>

      <main className="admin-main">
        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Productos</h3>
            <p className="stat-number">{menuItems.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Pedidos</h3>
            <p className="stat-number">{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pedidos Pendientes</h3>
            <p className="stat-number">
              {orders.filter(order => order.estado_pedido !== 'LISTO' && order.estado_pedido !== 'ENTREGADO').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Pagos Pendientes</h3>
            <p className="stat-number">
              {orders.filter(order => order.estado_pago === 'NO_PAGADO').length}
            </p>
          </div>
        </div>

        {/* Contenido según pestaña activa */}
        {activeTab === "products" ? (
          <>
            {/* Barra de acciones para productos */}
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
          </>
        ) : (
          <>
            {/* Gestión de Pedidos */}
            <div className="action-bar">
              <button className="btn-secondary" onClick={loadOrders}>
                🔄 Actualizar Pedidos
              </button>
            </div>

            <div className="table-container">
              {orders.length === 0 ? (
                <div className="empty-state">
                  <h3>No hay pedidos registrados</h3>
                  <p>Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
                </div>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Total</th>
                      <th>Estado Pedido</th>
                      <th>Estado Pago</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id_pedido}>
                        <td><strong>#{order.id_pedido}</strong></td>
                        <td>{formatDate(order.fecha_pedido)}</td>
                        <td>
                          <div>
                            <strong>{order.nombre_cliente}</strong>
                            <br />
                            {order.email_cliente}
                            <br />
                            {order.telefono_cliente}
                          </div>
                        </td>
                        <td>
                          <div className="order-items">
                            {order.items && order.items.map((item, index) => (
                              <div key={index} className="order-item">
                                {item.cantidad}x {item.nombre_producto}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="price-tag">
                            ${Number(order.total_pedido || 0).toFixed(2)}
                          </span>
                        </td>
                       <td>
                          <select
                            value={order.estado_pedido}  
                            onChange={(e) => handleOrderStatusChange(order.id_pedido, e.target.value)}
                            className={`status-select ${getStatusClass(order.estado_pedido)}`}
                          >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="CONFIRMADO">Confirmado</option>
                            <option value="EN_PREPARACION">En Preparacion</option>
                            <option value="LISTO">Listo</option>
                            <option value="ENTREGADO">Entregado</option>
                          </select>
                        </td>
                        <td>
                        <select
                          value={order.estado_pago}
                          onChange={(e) => handlePaymentStatusChange(order.id_pedido, e.target.value)}
                          className={`status-select ${getPaymentStatusClass(order.estado_pago)}`}
                        >
                          <option value="NO_PAGADO">No pagado</option>
                          <option value="PAGADO">Pagado</option>
                        </select>
                      </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-edit"
                              onClick={() => {
                                // Aquí puedes agregar funcionalidad para ver detalles del pedido
                                alert(`Detalles del pedido #${order.id_pedido}`);
                              }}
                            >
                              Ver Detalles
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal para crear/editar productos */}
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