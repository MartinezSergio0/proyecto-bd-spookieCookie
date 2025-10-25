"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario }),
      });

      const data = await res.json();

      if (data.success) {
        // usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify(data.cliente));

        // redirigir según rol
        if (data.cliente.rol === "admin") {
          router.push("/admin/dashboard"); // Admin dashboard
        } else {
          router.push("/"); // Home 
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Inicia Sesión 🍪</h2>
        <h1>Spooky Cookie</h1>
        <input
          type="text"
          placeholder="Usuario o correo"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">
          Entrar
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.push("/register")}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </form>
    </div>
  );
}
