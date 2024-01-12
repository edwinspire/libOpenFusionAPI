import { Sequelize } from 'sequelize'

const db_conn = process.env.DATABASE_URI_API || "sqlite::memory:";


// @ts-ignore
const dbsequelize = new Sequelize(db_conn, {
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

export default dbsequelize;

(async () => {

  try {
    await dbsequelize.authenticate()
    console.log('***** Connection has been established successfully to ' + db_conn)
  } catch (error) {
    console.error('**** Unable to connect to the database: ' + db_conn, error)
  }

})();
