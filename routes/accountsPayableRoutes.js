import express from "express";
const router = express.Router();

import AccountsPayableController from "../controllers/accountsPayableController.js";

router.use((req, res, next) => {
    next();
});

// Route to attend a travel request (update status to 4)
router.route("/attend-travel-request/:id")
    .put(AccountsPayableController.attendTravelRequest);

router.route("/get-expense-validations/:request_id")
    .get(AccountsPayableController.getExpenseValidations);

export default router;
