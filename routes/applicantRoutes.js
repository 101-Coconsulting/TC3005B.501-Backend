/*
Applicant Routes
*/
import express from "express";
const router = express.Router();
import applicantController from "../controllers/applicantController.js";
import { validateId, validateTravelRequest, validateExpenseReceipts, validateInputs, validateDraftTravelRequest } from "../middleware/validation.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

router.use((req, res, next) => {
    next();
});

router.route("/:id")
    .get(authenticateToken, authorizeRole(['Solicitante']), validateId, validateInputs, applicantController.getApplicantById);

// Route to get cost center by user ID
router.route("/get-cc/:user_id")
    .get(authenticateToken, authorizeRole(['Solicitante']), validateId, validateInputs, applicantController.getCostCenterByUserId);

router.route("/create-travel-request/:id")
    .post(authenticateToken, authorizeRole(['Solicitante']), validateId, validateTravelRequest, validateInputs, applicantController.createTravelRequest);

router.route("/edit-travel-request/:id")
    .put(authenticateToken, authorizeRole(['Solicitante']), validateId, validateTravelRequest, validateInputs, applicantController.editTravelRequest);

router.route("/cancel-travel-request/:request_id")
    .put(authenticateToken, authorizeRole(['Solicitante']), validateId, validateInputs, applicantController.cancelTravelRequest);

router.route("/create-expense-validation")
    .post(authenticateToken, authorizeRole(['Solicitante']), validateExpenseReceipts, validateInputs, applicantController.createExpenseValidationHandler);

router.route("/get-completed-requests/:id")
    .get(authenticateToken, authorizeRole(['Solicitante']), validateId, validateInputs, applicantController.getCompletedRequests);

router.route("/get-user-request/:id")
    .get(authenticateToken, authorizeRole(['Solicitante']), validateId, validateInputs, applicantController.getApplicantRequest);

router.route("/get-user-requests/:id")
    .get(authenticateToken, authorizeRole(['Solicitante']), validateId, validateInputs, applicantController.getApplicantRequests);

router.route("/create-draft-travel-request/:user_id")
    .post(authenticateToken, authorizeRole(['Solicitante']), validateId, validateDraftTravelRequest, validateInputs, applicantController.createDraftTravelRequest);

router.route("/confirm-draft-travel-request/:user_id/:request_id")
    .put(authenticateToken, authorizeRole(['Solicitante']), validateId, validateInputs, applicantController.confirmDraftTravelRequest);

router.route("/send-expense-validation/:request_id")
    .put(authenticateToken, authorizeRole(['Solicitante']), validateId, validateInputs, applicantController.sendExpenseValidation);

export default router;
