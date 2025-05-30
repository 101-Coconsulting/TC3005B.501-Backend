import express from "express";
const router = express.Router();
import { validateId, validateInputs } from "../middleware/validation.js";

import AccountsPayableController from "../controllers/accountsPayableController.js";

router.use((req, res, next) => {
    next();
});

router.route("/attend-travel-request/:request_id")
    .put(validateId, validateInputs, AccountsPayableController.attendTravelRequest);

router.route("/validate-receipts/:request_id")
    .put(AccountsPayableController.validateReceiptsHandler);

router.route("/validate-receipt/:receipt_id")
    .put(AccountsPayableController.validateReceipt);

router.route("/get-expense-validations/:request_id")
    .get(AccountsPayableController.getExpenseValidations);

export default router;
