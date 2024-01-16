import { Endpoint } from './models.js';
import { endpoins_default } from './default_values.js';
import PromiseSequence from "@edwinspire/sequential-promises";

export const upsertEndpoint = async (
	/** @type {import("sequelize").Optional<any, string>} */ data
) => {
	try {
		const [result, created] = await Endpoint.upsert(data, { returning: true });
		return { result, created };
	} catch (error) {
		console.error('Error retrieving:', error, data);
		throw error;
	}
};

// READ
export const getEndpointById = async (
	/** @type {import("sequelize").Identifier | undefined} */ idendpoint
) => {
	try {
		const endpoint = await Endpoint.findByPk(idendpoint);
		return endpoint;
	} catch (error) {
		console.error('Error retrieving user:', error);
		throw error;
	}
};

export const getAllEndpoints = async () => {
	try {
		const endpoints = await Endpoint.findAll();
		return endpoints;
	} catch (error) {
		console.error('Error retrieving:', error);
		throw error;
	}
};

// DELETE
export const deleteEndpoint = async (
	/** @type {import("sequelize").Identifier | undefined} */ idendpoint
) => {
	try {
		const ep = await Endpoint.findByPk(idendpoint);
		if (ep) {
			await ep.destroy();
			return true; // Deletion successful
		}
		return false; // User not found
	} catch (error) {
		console.error('Error deleting idendpoint:', error);
		throw error;
	}
};

// READ
export const getEndpointByApp = async (
	/** @type {import("sequelize").Identifier | undefined} */ appname
) => {
	try {
		const endpoints = await Endpoint.findAll({ where: { appname: appname } });
		return endpoints;
	} catch (error) {
		console.error('Error retrieving user:', error);
		throw error;
	}
};

export const defaultEndpoints = async () => {
	try {

		await PromiseSequence.ByBlocks(async (/** @type {{ idapp: any; resource: any; name: any; version: any; environment: any; method: any; }} */ element) => {
			let o;
			try {

				o = await Endpoint.findOrCreate({
					where: { idapp: element.idapp, environment: element.environment, resource: element.resource, method: element.method }, // Campos para la cláusula WHERE
					// @ts-ignore
					defaults: { code: element.code, handler: element.handler, access: element.access, }, // Campos para actualizar si se encuentra
				});
			} catch (error) {
				o = error;
			}
			return o;
		}, endpoins_default, 1);

	//	console.log('=====>>>> demoEndpoints >>==', out);

	} catch (error) {
		console.error('Error durante el demoEndpoints:', error);
	}
};

export const bulkCreateEndpoints = (
	/** @type {readonly import("sequelize").Optional<any, string>[]} */ list_endpoints
) => {
	// Campos que se utilizarán para verificar duplicados (en este caso, todos excepto 'rowkey' y 'idendpoint')
	//const uniqueFields = ['idapp', 'namespace', 'name', 'version', 'environment', 'method'];
	// OJO: No se pudo tener un bulk upsert
	return Endpoint.bulkCreate(list_endpoints, {
		ignoreDuplicates: true
		//updateOnDuplicate: uniqueFields
	});
};
