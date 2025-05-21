/*
User Routes
*/
import express from "express";
const router = express.Router();
import authorizerController from "../controllers/authorizerController.js";
import { validateUserId, validateInputs } from "../middleware/validation.js";

router.use((req, res, next) => {
    next();
});

router.route("/authorize-travel-request/:id/:user_id")
    .put(validateUserId, validateInputs, authorizerController.authorizeTravelRequest);


router.route("/decline-travel-request/:id/:user_id")
    .put(validateUserId, validateInputs, authorizerController.declineTravelRequest);

export default router;
