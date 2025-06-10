/*
Travel Agent Routes
Miguel Soria 26/04/25
Routes for travel agent
*/
import express from "express";
const router = express.Router();
import travelAgentController from "../controllers/travelAgentController.js";
import { validateId, validateInputs } from "../middleware/validation.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { generalRateLimiter } from "../middleware/rateLimiters.js";

router.use((req, res, next) => {
    next();
});

// Route to attend a travel request (update status to 4)
router.route("/attend-travel-request/:request_id")
    .put(generalRateLimiter, authenticateToken, authorizeRole(['Agencia de viajes']), validateId, validateInputs, travelAgentController.attendTravelRequest);

export default router;
