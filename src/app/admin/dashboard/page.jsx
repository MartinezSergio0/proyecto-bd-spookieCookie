"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.rol !== "admin") {
        router.push("/"); // redirigir si no es admin
      } else {
        setUsuario(user);
      }
    } else {
      router.push("/login"); // No hay usuario logueado
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">🍪 <span>SpookyCookie Admin</span></div>
        <nav className="nav">
          <button className="pill secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      <main className="main-content">
        <h1>Bienvenido, {usuario.nombre} 🍪</h1>
        <section className="admin-cards">
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/admin/clientes")}
          >
            <h2>Clientes</h2>
            <p>Ver y gestionar clientes</p>
          </div>
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/admin/pedidos")}
          >
            <h2>Pedidos</h2>
            <p>Ver y gestionar pedidos</p>
          </div>
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/admin/productos")}
          >
            <h2>Productos</h2>
            <p>Agregar, editar o eliminar productos</p>
          </div>
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/admin/decoraciones")}
          >
            <h2>Decoraciones</h2>
            <p>Administrar decoraciones disponibles</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} SpookyCookie Admin
      </footer>
    </div>
  );
}
