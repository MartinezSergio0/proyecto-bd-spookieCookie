"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="logo">🍪 <span>SpookyCookie</span></div>
        <nav className="nav">
          <a className="pill ghost" href="#">Menu</a>
          <a className="pill outline" href="/contacto">Contacto</a>
          {usuario ? (
            <button
              className="pill primary"
              onClick={() => router.push("/perfil")}
            >
              {usuario.nombre}
            </button>
          ) : (
            <a className="pill primary" href="/login">Iniciar sesión</a>
          )}
        </nav>
      </header>

      <main className="main-content" role="main">
        <section className="card">
          <figure className="cookie-card" aria-hidden>
            <div className="cookie-orbit">
              <img src="/cookie.png" alt="Galleta Spooky" className="cookie-img" />
              <div className="crumbs" aria-hidden />
            </div>
          </figure>
          <div className="card-body">
            <h1 className="title"><span className="accent">Spooky</span> Cookie</h1>
          </div>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} SpookyCookie — Hecho con 🍪 y CSS
      </footer>
    </div>
  );
}
