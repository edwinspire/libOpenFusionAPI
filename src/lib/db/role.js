import { Role } from './models.js';
import { Application } from './models.js';
import { AppToTable } from '../db/utils.js';
import { getAllMethods } from '../db/method.js';

export const defaultRoles = async () => {
	try {
		//	console.log(' defaultRoles >>>>>> ');

		// create super user
		const r0 = await Role.findOne({
			where: { role: 'super' }
		});

		console.log('defaultRoles ==> ', r0);

		if (!r0) {
			await Role.upsert({
				role: 'super',
				enabled: true,
				create_app: true,
				read_app: true,
				update_app: true,
				delete_app: true,
				notes: 'Super user'
			});
		}

		// create super user
		return await Role.findOne({
			where: { role: 'super' }
		});
	} catch (error) {
		console.error('Example error:', error);
		return;
	}
};

export const getAllEndpoints = async () => {
	try {
		// @ts-ignore
		let defaultMethods = {};
		const mtds = await getAllMethods();

		if (mtds && Array.isArray(mtds) && mtds.length > 0) {
			for (let i = 0; i < mtds.length; i++) {
				let m = mtds[i];
				// @ts-ignore
				defaultMethods[m.method] = {
					// @ts-ignore
					//method: m.method,
					// @ts-ignore
					//enabled: m.enabled,
					dev: false,
					qa: false,
					prd: false
				};
			}
		}

		const apps = await Application.findAll();

		let appDataTable = apps
			.map((a) => {
				return AppToTable(a);
			})
			.flat()
			.map((endp) => {
				let endpointAttr = {
					url: endp.url,
					enabled: endp.enabled,
					// @ts-ignore
					methods: defaultMethods
				};

				return endpointAttr;
			});
		//console.log("======> ", appDataTable);

		return appDataTable;
	} catch (error) {
		console.error('Error retrieving apps:', error);
		throw error;
	}
};

export const getRoleById = async (/** @type {import("sequelize").Identifier} */ idrole) => {
	try {
		const role = await Role.findByPk(idrole, {
			//	attributes: ['idrole', 'enabled', 'role', 'type', 'attrs']
		});

		return role;
	} catch (error) {
		console.error('Error retrieving app:', error);
		throw error;
	}
};
