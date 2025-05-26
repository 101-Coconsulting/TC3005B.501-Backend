/*
Applicant Routes
*/
import express from "express";
const router = express.Router();
import applicantController from "../controllers/applicantController.js";
import { validateId, validateTravelRequest, validateExpenseReceipts, validateInputs } from "../middleware/validation.js";

router.use((req, res, next) => {
    next();
});

router.route("/:id").get(validateId, validateInputs, applicantController.getApplicantById);

// Route to get cost center by user ID
router.route("/get-cc/:user_id").get(validateId, validateInputs, applicantController.getCostCenterByUserId);

router.route("/create-travel-request/:id")
    .post(validateTravelRequest, validateInputs, applicantController.createTravelRequest);

router.route("/edit-travel-request/:id")
    .put(validateId, validateTravelRequest, validateInputs, applicantController.editTravelRequest);

router.route("/cancel-travel-request/:request_id")
    .put(validateId, validateInputs, applicantController.cancelTravelRequest);

router.route("/create-expense-validation")
    .post(validateExpenseReceipts, validateInputs, applicantController.createExpenseValidationHandler);

router.route("/get-completed-requests/:id")
    .get(validateId, validateInputs, applicantController.getCompletedRequests);

router.route("/get-user-request/:id")
    .get(validateId, validateInputs, applicantController.getApplicantRequest);

router.route("/get-user-requests/:id")
    .get(validateId, validateInputs, applicantController.getApplicantRequests);

export default router;
