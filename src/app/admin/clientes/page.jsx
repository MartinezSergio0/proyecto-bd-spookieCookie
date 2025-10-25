"use client";
import { useEffect, useState } from "react";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("/api/admin/clientes");
        const data = await res.json();
        setClientes(data.clientes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  if (loading) return <p>Cargando clientes...</p>;

  return (
    <div>
      <h1>Clientes</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nombre}</td>
              <td>{c.correo}</td>
              <td>{c.telefono}</td>
              <td>{c.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
