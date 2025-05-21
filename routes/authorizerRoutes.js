/*
Authorizer Routes
*/
import express from "express";
const router = express.Router();
import authorizerController from "../controllers/authorizerController.js";
import { validateUserId, validateInputs } from "../middleware/validation.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-alerts/:dept_id/:status_id/:n")
    .get(authorizerController.authorizeTravelRequest);

router.route("/authorize-travel-request/:request_id/:user_id")
    .put(validateUserId, validateInputs, authorizerController.authorizeTravelRequest);

router.route("/decline-travel-request/:request_id/:user_id")
    .put(validateUserId, validateInputs, authorizerController.declineTravelRequest);

export default router;
