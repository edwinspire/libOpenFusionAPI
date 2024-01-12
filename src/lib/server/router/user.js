import express from 'express';
//import { getUserByCredentials } from '../../db/user.js';
//import { customError, EncryptPwd, validateToken } from '../utils.js';

//import { defaultSystemPath } from '../utils_path.js';

const router = express.Router();

/*
router.post(defaultSystemPath('user/password'), validateToken, async (req, res) => {
	try {
		if (req.body.new_password1 == req.body.new_password2) {
			// Check Token
			// @ts-ignore
			const dataToken = req.dataUser;
			let user = await getUserByCredentials(dataToken.username, EncryptPwd(req.body.password));

			if (user) {
				user.update({
					password: EncryptPwd(req.body.new_password1),
					token: ''
				});

				req.headers['api-token'] = '';

				// @ts-ignore
				res.status(200).json({ change: true, message: 'Login again' });
			} else {
				res.status(401).json(customError(2));
			}
		} else {
			res.status(403).json(customError(1));
		}
	} catch (error) {
		// @ts-ignore
		res.status(500).json(customError(0, error.message));
	}
});
*/

export default router;
