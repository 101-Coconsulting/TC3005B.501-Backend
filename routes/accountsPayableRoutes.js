import express from "express";
const router = express.Router();
import { validateUserId, validateInputs } from "../middleware/validation.js";

import AccountsPayableController from "../controllers/accountsPayableController.js";

router.use((req, res, next) => {
    next();
});

// Route to attend a travel request (update status to 4)
router.route("/attend-travel-request/:id")
    .put(validateInputs, validateInputs, AccountsPayableController.attendTravelRequest);

export default router;
