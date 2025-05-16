/*
Authorizer Routes
*/
import express from "express";
const router = express.Router();

import authorizerController from "../controllers/authorizerController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-alerts/:dept_id/:status_id/:n")
    .get(authorizerController.getAlerts);

router.route("/authorize-travel-request/:id/:user_id")
    .put(authorizerController.authorizeTravelRequest);


router.route("/decline-travel-request/:id/:user_id")
    .put(authorizerController.declineTravelRequest);

export default router;