import pool from "@/utils/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { usuario, password } = await req.json();

    const connTemp = await pool("cliente").getConnection();
    const rows = await connTemp.query(
      "SELECT * FROM cliente WHERE correo = ? OR nombre = ? LIMIT 1",
      [usuario, usuario]

    );
    connTemp.release();

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Usuario no encontrado" }),
        { status: 404 }
      );
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.contraseña);

    if (!match) {
      return new Response(
        JSON.stringify({ success: false, message: "Contraseña incorrecta" }),
        { status: 401 }
      );
    }

    const rol = user.rol;
    const conn = await pool(rol).getConnection();
    conn.release();

    return new Response(
      JSON.stringify({ success: true, cliente: user, rol }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Error en el servidor" }),
      { status: 500 }
    );
  }
}
