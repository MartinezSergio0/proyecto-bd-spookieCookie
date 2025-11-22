"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("datos");
  const router = useRouter();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUsuario(userData);
          // Si el usuario tiene id_cliente, cargar sus pedidos
          if (userData.id_cliente) {
            await cargarPedidosUsuario(userData.id_cliente);
          }
          setLoading(false);
          return;
        }

        if (response.ok) {
          const userData = await response.json();
          setUsuario(userData);
          await cargarPedidosUsuario(userData.id_cliente);
        } else {
          console.log('No hay sesión activa en el servidor');
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    const cargarPedidosUsuario = async (idCliente) => {
      try {
        const response = await fetch(`/api/clientes/pedidos?id_cliente=${idCliente}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const pedidosData = await response.json();
          console.log(pedidosData)
          setPedidos(pedidosData);
        }
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      }
    };

    cargarPerfil();
  }, []);

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      // Limpiar localStorage primero
      localStorage.removeItem('usuario');
      
      // Luego hacer logout en el servidor
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      router.push("/login");
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así redirigir al login
      localStorage.removeItem('usuario');
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="perfil-page">
        <div className="profile-login-prompt">
          <h1>Inicia sesión para ver tu perfil 🍪</h1>
          <p>Debes iniciar sesión para acceder a tu perfil y ver tus pedidos.</p>
          <button className="btn btn-primary" onClick={handleLoginRedirect}>
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-icon">
            {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
        <div className="profile-welcome">
          <h1>¡Hola, {usuario.nombre}! 🍪</h1>
          <p>Bienvenido a tu espacio personal de SpookyCookie</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === "datos" ? "active" : ""}`}
          onClick={() => setActiveTab("datos")}
        >
          Mis Datos
        </button>
        <button 
          className={`tab-btn ${activeTab === "pedidos" ? "active" : ""}`}
          onClick={() => setActiveTab("pedidos")}
        >
          Mis Pedidos
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "datos" && (
          <div className="profile-data-section">
            <div className="data-card">
              <h2>Información Personal</h2>
              <div className="data-grid">
                <div className="data-item">
                  <span className="data-label">Nombre completo:</span>
                  <span className="data-value">{usuario.nombre}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Correo electrónico:</span>
                  <span className="data-value">{usuario.correo}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Teléfono:</span>
                  <span className="data-value">{usuario.telefono || "No registrado"}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Dirección:</span>
                  <span className="data-value">{usuario.direccion || "No registrada"}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Tipo de cuenta:</span>
                  <span className="data-value role-badge">{usuario.rol}</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn btn-secondary">Editar información</button>
              <button className="btn btn-logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        )}

        {activeTab === "pedidos" && (
          <div className="orders-section">
            <h2>Historial de Pedidos</h2>
            {pedidos.length > 0 ? (
              <div className="orders-container">
                {pedidos.map((pedido) => (
                  <div key={pedido.id_pedido} className="order-card">
                    <div className="order-header">
                      <div className="order-id">Pedido #{pedido.id_pedido}</div>
                      <div className="order-date">
                        {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    <div className="order-status">
                      {/* Estado de pago */}
                      <span 
                        className={`status-badge status-${pedido.estado_pago ? pedido.estado_pago.toLowerCase() : 'pendiente'}`}
                      >
                        {pedido.estado_pago || 'Pendiente'}
                      </span>

                      {/* Estado del pedido */}
                      <span 
                        className={`status-badge status-${pedido.estado_pedido ? pedido.estado_pedido.toLowerCase() : 'pendiente'}`}
                      >
                        {pedido.estado_pedido || 'Pendiente'}
                      </span>

                      <span className="order-total">
                        Total: ${pedido.total ? pedido.total.toFixed(2) : '0.00'}
                      </span>
                    </div>

                    
                    <div className="order-products">
                      <h4>Productos:</h4>
                      {pedido.productos && pedido.productos.length > 0 ? (
                        <div className="productos-lista">
                          {pedido.productos.map((producto, index) => (
                            <div key={index} className="producto-item">
                              <span className="producto-nombre">{producto.nombre}</span>
                              <span className="producto-cantidad">x{producto.cantidad}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Sin productos</p>
                      )}
                    </div>
                    
                    <div className="order-actions">
                      <button className="btn btn-small">Ver detalles</button>
                      <button className="btn btn-small btn-secondary">Repetir pedido</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <div className="no-orders-icon">🛒</div>
                <h3>No tienes pedidos realizados</h3>
                <p>¡Descubre nuestras deliciosas galletas y haz tu primer pedido!</p>
                <button className="btn btn-primary" onClick={() => router.push('/menu')}>
                  Ver menú
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}