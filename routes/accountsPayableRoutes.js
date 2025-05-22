import express from "express";
const router = express.Router();

import AccountsPayableController from "../controllers/accountsPayableController.js";

router.use((req, res, next) => {
    next();
});

// Route to attend a travel request (update status to 4)
router.route("/attend-travel-request/:request_id")
    .put(AccountsPayableController.attendTravelRequest);

router.route("/validate-receipts/:request_id")
    .put(AccountsPayableController.validateReceiptsHandler);

export default router;
