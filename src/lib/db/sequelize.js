import os from "os";
import path from "path";
import { Sequelize } from "sequelize";

//Temporal DDBB
const tmpPath = path.join(os.tmpdir(), "ofapi.sqlite");

const db_conn =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URI_API ||
  `sqlite:${tmpPath}`;

let dialectOptions;
if (process.env.USE_HEROKU_POSTGRESQL) {
  dialectOptions = { ssl: { rejectUnauthorized: false } };
}

const options = {
  logging: false, // Imprime el SQL en consola
  dialectOptions: dialectOptions,
  pool: {
    max: db_conn.includes("sqlite") ? 1 : 20,
    min: 1,
    acquire: 30000,
    idle: 10000,
  },
};

const dbsequelize = new Sequelize(db_conn, options);

export default dbsequelize;

(async () => {
  try {
    await dbsequelize.authenticate();
    console.log(
      ">>>>>>>>> Connection has been established successfully to " + db_conn,
      options
    );
  } catch (error) {
    console.error(
      ">>>>>>>>> Unable to connect to the database: " + db_conn,
      options,
      error
    );
  }
})();
