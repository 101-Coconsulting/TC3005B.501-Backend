import express from "express";
const router = express.Router();
import { validateId, validateInputs } from "../middleware/validation.js";

import AccountsPayableController from "../controllers/accountsPayableController.js";

router.use((req, res, next) => {
    next();
});

// Route to attend a travel request (update status to 4)
router.route("/attend-travel-request/:request_id")
    .put(validateId, validateInputs, AccountsPayableController.attendTravelRequest);

router.route("/get-expense-validations/:request_id")
    .get(validateId, validateInputs, AccountsPayableController.getExpenseValidations);

export default router;
