/*
Applicant Routes
*/
import express from "express";
const router = express.Router();

import { getApplicantById, createExpenseValidationHandler, getApplicantRequest } from "../controllers/applicantController.js";

router.use((req, res, next) => {
    next();
});

router.route("/:id")
    .get(getApplicantById);

router.route("/create-expense-validation")
    .post(createExpenseValidationHandler);

router.route("/get-user-request/:id")
    .get(getApplicantRequest);

export default router;