/*
User Routes
*/
import express from "express";
const router = express.Router();

import authorizerController from "../controllers/authorizerController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-alerts/:dept_id/:status/:n")
  .put(authorizerController.getAlerts);

export default router;
