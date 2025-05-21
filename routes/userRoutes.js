import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { validateUserId, validateInputs } from "../middleware/validation.js";

router.route("/get-user-data/:user_id")
    .get(validateUserId, validateInputs, userController.getUserData);


export default router;
