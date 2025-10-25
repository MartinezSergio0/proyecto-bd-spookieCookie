import pool from "@/utils/db";

export async function POST(req) {
  try {
    const { usuario } = await req.json();

    const connTemp = await pool("admin").getConnection();
    const rows = await connTemp.query(
      "SELECT * FROM cliente WHERE correo = ? OR nombre = ? LIMIT 1",
      [usuario, usuario]
    );
    connTemp.release();

    if (rows.length > 0) {
      const user = rows[0];
      const rol = user.rol;

      const conn = await pool(rol).getConnection();
      conn.release();

      return new Response(
        JSON.stringify({ success: true, cliente: user, rol }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Usuario no encontrado" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Error en el servidor" }),
      { status: 500 }
    );
  }
}
