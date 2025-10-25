"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "", nombre: "", telefono: "", direccion: "", password: ""
  });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica de registro aquí
  };

  return (
    <div>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>REGISTRO</h2>
        <h1>SP00KY COOKIE</h1>
        <input
          type="email" name="email" placeholder="Correo"
          value={form.email} onChange={handleChange} required
        />
        <input
          name="nombre" placeholder="Nombre completo"
          value={form.nombre} onChange={handleChange} required
        />
        <input
          name="telefono" placeholder="Teléfono"
          value={form.telefono} onChange={handleChange}
        />
        <input
          name="direccion" placeholder="Dirección"
          value={form.direccion} onChange={handleChange}
        />
        <input
          type="password" name="password" placeholder="Contraseña"
          value={form.password} onChange={handleChange} required
        />
        <button type="submit">REGISTRARSE</button>
        <button type="button" onClick={() => router.push('/login')}>
          Ir a iniciar sesión
        </button>
      </form>
    </div>
  );
}
