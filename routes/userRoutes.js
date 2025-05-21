import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { validateUserId, validateInputs, validateDeptStatus } from "../middleware/validation.js";

router.route("/get-user-data/:user_id")
    .get(validateUserId, validateInputs, userController.getUserData);

router.route('/get-travel-request/:request_id')
    .get(validateUserId, validateInputs, userController.getTravelRequestById);

router.route('/get-travel-requests/:dept/:status/:n?')
    .get(validateDeptStatus, validateInputs, userController.getTravelRequestsByDeptStatus);

export default router;
