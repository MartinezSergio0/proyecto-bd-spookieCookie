"use client";
import { useState } from "react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData);
    alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: ""
    });
  };

  return (
    <div className="contacto-page">
      {/* Header */}
      <header className="header">
        <div className="logo">🍪 <span>SpookyCookie</span></div>
        <nav className="nav">
          <a className="pill ghost" href="/menu">Menu</a>
          <a className="pill primary" href="/">Inicio</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="contacto-main">
        <div className="contacto-container">
          {/* Información de contacto */}
          <div className="contacto-info">
            <h1 className="contacto-title">CONTACTO</h1>
            
            <div className="telefonos-section">
              <div className="telefono-item">
                <span className="telefono-prefix">6-</span>
                <span className="telefono-numero">62351XXI</span>
              </div>
              <div className="telefono-item">
                <span className="telefono-prefix">8-</span>
                <span className="telefono-numero">65117720</span>
              </div>
            </div>

            <div className="info-adicional">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <span>contacto@spookycookie.com</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>Calle Dulce 123, Ciudad Galleta</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🕒</span>
                <span>Lun-Vie: 9:00 - 18:00</span>
              </div>
            </div>

            <div className="redes-sociales">
              <h3>Síguenos en:</h3>
              <div className="redes-icons">
                <a href="#" className="red-social">📘</a>
                <a href="#" className="red-social">📷</a>
                <a href="#" className="red-social">🐦</a>
                <a href="#" className="red-social">📺</a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} SpookyCookie — Hecho con 🍪 y CSS
      </footer>
      </div>
 );
}