# Spookie Cookie

Aplicación web desarrollada con Next.js para la gestión de una repostería. Permite administrar productos, clientes y pedidos desde una interfaz moderna y sencilla. Conecta con una base de datos mediante Prisma o Mongoose para optimizar el control de inventario y ventas.

## Instalación

```bash
npm install
```

## Comandos sql para la creacion de la base de datos

```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS reposteria;
USE reposteria;

-- Tabla de clientes
CREATE TABLE cliente (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  telefono VARCHAR(15),
  correo VARCHAR(50) UNIQUE,
  direccion VARCHAR(100),
  rol ENUM('cliente','admin') NOT NULL DEFAULT 'cliente'
);

-- Tabla de decoraciones
CREATE TABLE decoracion (
  id_decoracion INT AUTO_INCREMENT PRIMARY KEY,
  estilo VARCHAR(50),
  color_principal VARCHAR(50),
  forma VARCHAR(50),
  notas VARCHAR(100)
);

-- Tabla de productos
CREATE TABLE producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  precio_base DECIMAL(10,2) NOT NULL,
  tipo VARCHAR(50) NOT NULL
);

-- Tabla de pedidos
CREATE TABLE pedido (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  fecha_pedido DATE NOT NULL,
  fecha_entrega DATE NOT NULL,
  estado VARCHAR(20),
  id_decoracion INT NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  FOREIGN KEY (id_decoracion) REFERENCES decoracion(id_decoracion)
);

-- Tabla de detalle de pedidos
CREATE TABLE detalle_pedido (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
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
