import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { validateId, validateInputs, validateDeptStatus } from "../middleware/validation.js";
import { authenticateToken } from '../middleware/auth.js';

router.route("/get-user-data/:user_id")
    .get(authenticateToken, validateId, validateInputs, userController.getUserData);

router.route('/login')
    .post(loginRateLimiter, userController.login);

router.route("/logout")
    .get(userController.logout);
    
router.route('/get-travel-request/:request_id')
    .get(authenticateToken, validateId, validateInputs, userController.getTravelRequestById);

router.route('/get-travel-requests/:dept_id/:status_id/:n?')
    .get(authenticateToken, validateDeptStatus, validateInputs, userController.getTravelRequestsByDeptStatus);

router.route('/get-user-wallet/:user_id?')
    .get(authenticateToken, validateId, validateInputs, userController.getUserWallet);

export default router;
