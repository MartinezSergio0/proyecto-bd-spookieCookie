"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await res.json();

      if (data.success) {
        const rol = data.cliente.rol;
        const token = btoa(JSON.stringify({ rol, timestamp: Date.now() }));
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(data.cliente));
        if (data.cliente.rol === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Inicia Sesión <span role="img" aria-label="cookie">🍪</span></h2>
        <h1>Spooky Cookie</h1>
        <input
          type="text"
          placeholder="Usuario o correo"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <div className="form-actions">
          <button 
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'VERIFICANDO...' : 'Entrar'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => router.push('/register')}
            disabled={isLoading}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </form>
    </div>
  );
}
