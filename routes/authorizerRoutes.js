/*
Authorizer Routes
*/
import express from "express";
const router = express.Router();
import authorizerController from "../controllers/authorizerController.js";
import { validateId, validateInputs, validateDeptStatus } from "../middleware/validation.js";
<<<<<<< HEAD
import { generalRateLimiter } from "../middleware/rateLimiters.js";
=======
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
>>>>>>> 7f38c61 (feat: add route protection to authorizer endpoints)

router.use((req, res, next) => {
    next();
});

router.route("/get-alerts/:dept_id/:status_id/:n")
    .get(generalRateLimiter, authenticateToken, authorizeRole(['N1', 'N2']), validateDeptStatus, validateInputs, authorizerController.getAlerts);

router.route("/authorize-travel-request/:request_id/:user_id")
<<<<<<< HEAD
<<<<<<< HEAD
    .put(validateId, validateInputs, generalRateLimiter, authorizerController.authorizeTravelRequest);

router.route("/decline-travel-request/:request_id/:user_id")
    .put(validateId, validateInputs, generalRateLimiter, authorizerController.declineTravelRequest);
=======
    .put(authenticateToken, authorizeRole(['N1', 'N2']), validateId, validateInputs, authorizerController.authorizeTravelRequest);

router.route("/decline-travel-request/:request_id/:user_id")
    .put(authenticateToken, authorizeRole(['N1', 'N2']), validateId, validateInputs, authorizerController.declineTravelRequest);
>>>>>>> 7f38c61 (feat: add route protection to authorizer endpoints)
=======
    .put(generalRateLimiter, authenticateToken, authorizeRole(['N1', 'N2']), validateId, validateInputs, authorizerController.authorizeTravelRequest);

router.route("/decline-travel-request/:request_id/:user_id")
    .put(generalRateLimiter, authenticateToken, authorizeRole(['N1', 'N2']), validateId, validateInputs, authorizerController.declineTravelRequest);
>>>>>>> 53d76af (chore: add rate limiters to all routes according to CodeQL)

export default router;
