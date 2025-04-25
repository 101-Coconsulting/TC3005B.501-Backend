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

export default router;