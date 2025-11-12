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

  // Efecto para las chispas
  useEffect(() => {
    const createSpark = () => {
      const spark = document.createElement('div');
      spark.classList.add('spark');
      
      // Colores aleatorios para las chispas
      const colors = ['#e38ca9', '#ffb6c1', '#ffd700', '#a8e6cf', '#ff8e8e', '#d4a5a5'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      spark.style.backgroundColor = randomColor;
      spark.style.boxShadow = `0 0 10px ${randomColor}`;
      
      // Posición aleatoria en la pantalla
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      
      spark.style.left = `${posX}px`;
      spark.style.top = `${posY}px`;
      
      // Movimiento aleatorio
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;
      
      spark.style.setProperty('--tx', `${tx}px`);
      spark.style.setProperty('--ty', `${ty}px`);
      
      // Duración aleatoria
      const duration = Math.random() * 1.5 + 0.5;
      spark.style.animation = `sparkAnimation ${duration}s forwards`;
      
      document.body.appendChild(spark);
      
      // Eliminar la chispa después de la animación
      setTimeout(() => {
        if (spark.parentNode) {
          spark.parentNode.removeChild(spark);
        }
      }, duration * 1000);
    };

    // Crear chispas continuamente
    const sparkInterval = setInterval(createSpark, 100);
    
    // Crear chispas adicionales al hacer clic
    const handleClick = (e) => {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          createSpark();
        }, i * 50);
      }
    };

    document.addEventListener('click', handleClick);
    
    // Limpiar
    return () => {
      clearInterval(sparkInterval);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="logo">🍪 <span>SpookyCookie</span></div>
        <nav className="nav">
          <a className="pill ghost" href="/menu">Menu</a>
          <a className="pill outline" href="/contact">Contacto</a>
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