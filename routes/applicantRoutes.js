/*
Applicant Routes
*/
import express from "express";
const router = express.Router();
import applicantController from "../controllers/applicantController.js";
import { validateUserId, validateTravelRequest, validateExpenseReceipts, validateInputs } from "../middleware/validation.js";

router.use((req, res, next) => {
    next();
});

router.route("/:id").get(validateUserId, validateInputs, applicantController.getApplicantById);

// Route to get cost center by user ID
router.route("/get-cc/:user_id").get(validateUserId, validateInputs, applicantController.getCostCenterByUserId);

router.route("/create-travel-request/:id")
    .post(validateTravelRequest, validateInputs, applicantController.createTravelRequest);

router.route("/edit-travel-request/:id")
    .put(validateUserId, validateTravelRequest, validateInputs, applicantController.editTravelRequest);

router.route("/cancel-travel-request/:request_id")
    .put(validateUserId, validateInputs, applicantController.cancelTravelRequest);

router.route("/create-expense-validation")
    .post(validateExpenseReceipts, validateInputs, applicantController.createExpenseValidationHandler);

router.route("/get-completed-requests/:id")
    .get(validateUserId, validateInputs, applicantController.getCompletedRequests);

router.route("/get-user-request/:id")
    .get(validateUserId, validateInputs, applicantController.getApplicantRequest);

router.route("/get-user-requests/:id")
    .get(validateUserId, validateInputs, applicantController.getApplicantRequests);

export default router;
