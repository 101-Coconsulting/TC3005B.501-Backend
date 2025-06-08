/*
Applicant Routes
*/
import express from "express";
const router = express.Router();
import applicantController from "../controllers/applicantController.js";
import { validateId, validateTravelRequest, validateExpenseReceipts, validateInputs, validateDraftTravelRequest } from "../middleware/validation.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { generalRateLimiter } from "../middleware/rateLimiters.js";

router.use((req, res, next) => {
    next();
});

router.route("/:id")
    .get(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateInputs, applicantController.getApplicantById);

// Route to get cost center by user ID
router.route("/get-cc/:user_id")
    .get(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateInputs, applicantController.getCostCenterByUserId);

router.route("/create-travel-request/:id")
    .post(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateTravelRequest, validateInputs, applicantController.createTravelRequest);

router.route("/edit-travel-request/:id")
    .put(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateTravelRequest, validateInputs, applicantController.editTravelRequest);

router.route("/cancel-travel-request/:request_id")
    .put(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateInputs, applicantController.cancelTravelRequest);

router.route("/create-expense-validation")
    .post(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateExpenseReceipts, validateInputs, applicantController.createExpenseValidationHandler);

router.route("/get-completed-requests/:id")
    .get(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateInputs, applicantController.getCompletedRequests);

router.route("/get-user-request/:id")
    .get(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2', 'Agencia de viajes']), validateId, validateInputs, applicantController.getApplicantRequest);

router.route("/get-user-requests/:id")
    .get(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2', 'Agencia de viajes']), validateId, validateInputs, applicantController.getApplicantRequests);

router.route("/create-draft-travel-request/:user_id")
    .post(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateDraftTravelRequest, validateInputs, applicantController.createDraftTravelRequest);

router.route("/confirm-draft-travel-request/:user_id/:request_id")
    .put(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateInputs, applicantController.confirmDraftTravelRequest);

router.route("/send-expense-validation/:request_id")
    .put(generalRateLimiter, authenticateToken, authorizeRole(['Solicitante', 'N1', 'N2']), validateId, validateInputs, applicantController.sendExpenseValidation);

export default router;
