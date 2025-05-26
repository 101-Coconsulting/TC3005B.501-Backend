import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { validateId, validateInputs, validateDeptStatus } from "../middleware/validation.js";

router.route("/get-user-data/:user_id")
    .get(validateId, validateInputs, userController.getUserData);

router.route('/get-travel-request/:request_id')
    .get(validateId, validateInputs, userController.getTravelRequestById);

router.route('/get-travel-requests/:dept_id/:status_id/:n?')
    .get(validateDeptStatus, validateInputs, userController.getTravelRequestsByDeptStatus);

export default router;
