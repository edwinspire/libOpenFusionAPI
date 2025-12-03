import os from "os";
import path from "path";
import { Sequelize } from "sequelize";

//Temporal DDBB
const tmpPath = path.join(os.tmpdir(), "ofapi.sqlite");

const db_conn = process.env.DATABASE_URL || process.env.DATABASE_URI_API || `sqlite:${tmpPath}`;

const dbsequelize = new Sequelize(db_conn, {
  logging: false, // Imprime el SQL en consola
  pool: {
    max: db_conn.includes("sqlite") ? 1 : 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default dbsequelize;

(async () => {
  try {
    await dbsequelize.authenticate();
    console.log(
      ">>>>>>>>> Connection has been established successfully to " + db_conn
    );
  } catch (error) {
    console.error(
      ">>>>>>>>> Unable to connect to the database: " + db_conn,
      error
    );
  }
})();
