/*
Authorizer Routes
*/
import express from "express";
const router = express.Router();
import authorizerController from "../controllers/authorizerController.js";
import { validateId, validateInputs, validateDeptStatus } from "../middleware/validation.js";
import { generalRateLimiter } from "../middleware/rateLimiters.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-alerts/:dept_id/:status_id/:n")
    .get(validateDeptStatus, validateInputs, authorizerController.getAlerts);

router.route("/authorize-travel-request/:request_id/:user_id")
    .put(validateId, validateInputs, generalRateLimiter, authorizerController.authorizeTravelRequest);

router.route("/decline-travel-request/:request_id/:user_id")
    .put(validateId, validateInputs, generalRateLimiter, authorizerController.declineTravelRequest);

export default router;
