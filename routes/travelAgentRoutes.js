/*
Travel Agent Routes
Miguel Soria 26/04/25
Routes for travel agent
*/
import express from "express";
const router = express.Router();
import travelAgentController from "../controllers/travelAgentController.js";
import { validateUserId, validateInputs } from "../middleware/validation.js";

router.use((req, res, next) => {
    next();
});

// Route to attend a travel request (update status to 4)
router.route("/attend-travel-request/:id")
    .put(validateUserId, validateInputs, travelAgentController.attendTravelRequest);

export default router;
