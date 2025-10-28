"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    } else {
      // Si no hay usuario logueado, redirige al login
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  if (!usuario) return null; 
  return (
    <div className="perfil-page">
      <h1>Bienvenido, {usuario.nombre} 🍪</h1>
      <p>Correo: {usuario.correo}</p>
      <p>Teléfono: {usuario.telefono || "No registrado"}</p>

      <button className="btn btn-primary" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}