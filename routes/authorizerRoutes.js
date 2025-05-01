/*
Authorizer Routes
*/
import express from "express";
const router = express.Router();

import authorizerController from "../controllers/authorizerController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-travel-request/:id")
    .get(authorizerController.getTravelRequest);

router.route("/get-travel-requests/:dept/:status/:n")
    .get(authorizerController.getTravelRequestsDept);

router.route("/get-alerts/:dept_id/:status_id/:n")
    .get(authorizerController.getAlerts);

export default router;
