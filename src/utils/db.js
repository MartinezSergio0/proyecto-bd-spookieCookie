    import mariadb from "mariadb";

    let adminPool;
    let clientePool;

    const pool = (rol = "cliente") => {
    if (rol === "admin") {
        if (!adminPool) {
        adminPool = mariadb.createPool({
            host: "localhost",
            user: "r_admin",
            password: "Adm1nC00kie!",
            database: "reposteria",
            connectionLimit: 5,
        });
        }
        return adminPool;
    } else {
        if (!clientePool) {
        clientePool = mariadb.createPool({
            host: "localhost",
            user: "r_cliente",
            password: "Cl13nt3C00kie!",
            database: "reposteria",
            connectionLimit: 5,
        });
        }
        return clientePool;
    }
    };

    export default pool;
