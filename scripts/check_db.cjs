// Use the project's sequelize dependency to query the DB
import('../src/lib/db/sequelize.js').then(async (mod) => {
	const seq = mod.default || mod.sequelize;
	if (!seq) {
		// fallback: try raw sequelize from package
		const { Sequelize } = await import('sequelize');
		const db = new Sequelize(process.env.DATABASE_URI_API || 'sqlite:./test.sqlite', { logging: false });
		const [rows] = await db.query("SELECT idendpoint, resource, environment, enabled FROM ofapi_endpoint ORDER BY idendpoint DESC LIMIT 15");
		console.log("Last endpoints in DB:", JSON.stringify(rows, null, 2));
		await db.close();
		return;
	}
	const [rows] = await seq.query("SELECT idendpoint, resource, environment, enabled FROM ofapi_endpoint ORDER BY idendpoint DESC LIMIT 15");
	console.log("Last endpoints in DB:", JSON.stringify(rows, null, 2));
}).catch(e => console.error(e.message));
