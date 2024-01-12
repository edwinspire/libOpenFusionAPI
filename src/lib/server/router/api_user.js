import express from 'express';
//import { upsertAPIUser } from '../../db/api_user.js';
//import { validateToken, EncryptPwd } from '../utils.js';
//import { defaultSystemPath } from '../utils_path.js';

const router = express.Router();

/*
router.post(defaultSystemPath('api_user'), validateToken, async (req, res) => {
	try {
		//console.log(req.headers);

		let data = { ...req.body };

		if (data && data.password) {
			data.password = EncryptPwd(data.password);
		}

		let { result } = await upsertAPIUser(data);

		if (result) {
			res.status(200).json(result.toJSON());
		} else {
			res.status(401).json({});
		}
	} catch (error) {
		console.log(error);
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
});
*/

export default router;
