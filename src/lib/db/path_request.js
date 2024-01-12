import { PathRequest } from './models.js';

export const createPathRequest = async (/** @type {any} */ path_request, /** @type {any} */ ip, /** @type {any} */ headers, /** @type {any} */ idapp) => {
	try {
		//	console.log(' defaultRoles >>>>>> ');

		// create super user
		return await PathRequest.findOrCreate({
			where: { path: path_request },
			defaults: { path: path_request, headers_create: headers, ip_create: ip, idapp: idapp }
		});
	} catch (error) {
		console.error('Example error:', error);
		return;
	}
};
