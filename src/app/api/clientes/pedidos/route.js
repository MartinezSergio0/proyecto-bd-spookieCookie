import pool from "@/utils/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id_cliente, fecha_pedido, estado_pago, detalles } = body;

    if (!id_cliente || !fecha_pedido || !estado_pago || !detalles || !detalles.length) {
      return new Response(JSON.stringify({ error: "Faltan datos del pedido" }), { status: 400 });
    }

    const [pedidoRows] = await pool.query(
      "CALL crear_pedido(?, ?, ?)",
      [id_cliente, fecha_pedido, estado_pago]
    );

    // Extraer id_pedido creado
    const nuevoPedido = pedidoRows[0][0];
    const id_pedido = nuevoPedido.id_pedido_creado;

    for (const detalle of detalles) {
      const { id_producto, cantidad, precio_unitario } = detalle;

      await pool.query(
        `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [id_pedido, id_producto, cantidad, precio_unitario]
      );
    }

    return new Response(
      JSON.stringify({ message: "Pedido y detalles guardados correctamente", id_pedido }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return new Response(JSON.stringify({ error: "Error en el servidor", detalles: error.message }), { status: 500 });
  }
}
