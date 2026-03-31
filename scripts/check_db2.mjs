import('sequelize').then(async ({Sequelize}) => {
  const db = new Sequelize('sqlite:./test.sqlite', {logging:false});
  
  const [countResult] = await db.query("SELECT COUNT(*) as n FROM ofapi_endpoint");
  console.log("Total endpoints:", countResult[0].n);
  
  const [rows] = await db.query(
    "SELECT idendpoint, resource, environment, enabled FROM ofapi_endpoint WHERE idendpoint IN ('8ea38d24-a24a-4039-a819-1a89691ed102','9a4e24c9-f563-42b2-b7db-b4bc4b03c5c1')"
  );
  console.log("Created endpoints found:", JSON.stringify(rows));
  
  const [dbRows] = await db.query(
    "SELECT idendpoint, resource, environment, enabled FROM ofapi_endpoint WHERE resource LIKE '%db%' OR resource LIKE '%schema%' ORDER BY rowid DESC LIMIT 10"
  );
  console.log("DB/schema related endpoints:", JSON.stringify(dbRows, null, 2));
  
  await db.close();
}).catch(e => console.error(e.message, e.stack));
