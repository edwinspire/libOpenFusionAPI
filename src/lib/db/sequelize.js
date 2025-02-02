import { Sequelize } from "sequelize";

const db_conn = process.env.DATABASE_URI_API || "sqlite::memory:";

const dbsequelize = new Sequelize(db_conn, {
  pool: {
    max: db_conn.includes("sqlite") ? 1 : 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
    logging: false, // Imprime el SQL en consola
  },
});

export default dbsequelize;

(async () => {
  try {
    await dbsequelize.authenticate();
    console.log(
      "***** Connection has been established successfully to " + db_conn
    );
  } catch (error) {
    console.error("**** Unable to connect to the database: " + db_conn, error);
  }
})();
