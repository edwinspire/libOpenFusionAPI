import express from 'express';
//import { getRoleById } from '../../db/role.js';
//import { customError, validateToken } from '../utils.js';
//import { defaultSystemPath } from '../utils_path.js';

const router = express.Router();

/*
router.get(
  defaultSystemPath("role/endpoints"),
  validateToken,
  async (req, res) => {
    try {
      let endpoints = await getAllEndpoints();

      res.status(200).json(endpoints);
    } catch (error) {
      // @ts-ignore
      res.status(500).json(customError(0, error.message));
    }
  }
);
*/

/*
router.get(defaultSystemPath('role/:idrole'), validateToken, async (req, res) => {
	//  console.log("role/:idrole", req.params);
	let onlyData = req.query.onlyData && req.query.onlyData == 'true' ? true : false;

	let idrole = req.params.idrole || -1;

	try {
		let endpoints = await getRoleById(idrole, onlyData);

		res.status(200).json(endpoints);
	} catch (error) {
		// @ts-ignore
		res.status(500).json(customError(0, error.message));
	}
});
*/

export default router;
