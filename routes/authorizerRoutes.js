/*
Authorizer Routes
*/
import express from "express";
const router = express.Router();
import authorizerController from "../controllers/authorizerController.js";
import { validateId, validateInputs, validateDeptStatus } from "../middleware/validation.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-alerts/:dept_id/:status_id/:n")
    .get(authenticateToken, authorizeRole(['N1', 'N2']), validateDeptStatus, validateInputs, authorizerController.getAlerts);

router.route("/authorize-travel-request/:request_id/:user_id")
    .put(authenticateToken, authorizeRole(['N1', 'N2']), validateId, validateInputs, authorizerController.authorizeTravelRequest);

router.route("/decline-travel-request/:request_id/:user_id")
    .put(authenticateToken, authorizeRole(['N1', 'N2']), validateId, validateInputs, authorizerController.declineTravelRequest);

export default router;
