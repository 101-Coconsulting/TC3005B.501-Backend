/*
User Routes
*/
import express from "express";
const router = express.Router();

import authorizerController from "../controllers/authorizerController.js";

router.use((req, res, next) => {
    next();
});

router.route("/authorize-travel-request/:id")
    .put(authorizerController.authorizeTravelRequest);


router.route("/decline-travel-request/:id")
    .put(authorizerController.declineTravelRequest);

export default router;