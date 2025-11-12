# Spookie Cookie

Aplicación web desarrollada con Next.js para la gestión de una repostería. Permite administrar productos, clientes y pedidos desde una interfaz moderna y sencilla. Conecta con una base de datos para optimizar el control de inventario y ventas.

## Instalación

```bash
npm install
```

## Comandos sql para la creacion de la base de datos

```sql
-- Tabla: cliente
CREATE TABLE cliente (
    id_cliente INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    telefono VARCHAR(15),
    correo VARCHAR(50) UNIQUE,
    direccion VARCHAR(100),
    rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
    contraseña VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_cliente)
);

-- Tabla: producto
CREATE TABLE producto (
    id_producto INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio_base DECIMAL(6,2) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    ingredientes LONGTEXT NOT NULL,
    imagen VARCHAR(150),
    PRIMARY KEY (id_producto)
);

-- Tabla: pedido
CREATE TABLE pedido (
    id_pedido INT(11) NOT NULL AUTO_INCREMENT,
    id_cliente INT(11) NOT NULL,
    fecha_pedido DATE NOT NULL,
    estado_pago ENUM('PAGADO', 'NO_PAGADO') NOT NULL DEFAULT 'NO_PAGADO',
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Tabla: detalle_pedido
CREATE TABLE detalle_pedido (
    id_detalle INT(11) NOT NULL AUTO_INCREMENT,
    id_pedido INT(11) NOT NULL,
    id_producto INT(11) NOT NULL,
    cantidad INT(11) NOT NULL,
    precio_unitario DECIMAL(6,2) NOT NULL,
    PRIMARY KEY (id_detalle),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
```

### Usuarios de la base de datos

```sql
-- Crear roles
CREATE ROLE IF NOT EXISTS r_admin_role;
CREATE ROLE IF NOT EXISTS r_cliente_role;

-- Asignar privilegios a los roles
GRANT ALL PRIVILEGES ON reposteria.* TO r_admin_role;

GRANT SELECT ON reposteria.decoracion TO r_cliente_role;
GRANT SELECT ON reposteria.producto TO r_cliente_role;
GRANT INSERT ON reposteria.pedido TO r_cliente_role;

-- Crear usuarios
CREATE USER IF NOT EXISTS 'r_admin'@'localhost' IDENTIFIED BY 'Adm1nC00kie!';
CREATE USER IF NOT EXISTS 'r_cliente'@'localhost' IDENTIFIED BY 'Cl13nt3C00kie!';

-- Asignar roles a los usuarios
GRANT r_admin_role TO 'r_admin'@'localhost';
GRANT r_cliente_role TO 'r_cliente'@'localhost';

-- Establecer roles por defecto
SET DEFAULT ROLE r_admin_role FOR 'r_admin'@'localhost';
SET DEFAULT ROLE r_cliente_role FOR 'r_cliente'@'localhost';
```
