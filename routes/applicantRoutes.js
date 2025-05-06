/*
Applicant Routes
*/
import express from "express";
const router = express.Router();
import applicantController from "../controllers/applicantController.js";

router.use((req, res, next) => {
    next();
});

router.route("/:id").get(applicantController.getApplicantById);

// Route to get cost center by user ID
router.route("/get-cc/:user_id").get(applicantController.getCostCenterByUserId);

router.route("/create-travel-request/:id")
    .post(applicantController.createTravelRequest);

router.route("/edit-travel-request/:id")
    .put(applicantController.editTravelRequest);

router.route("/cancel-travel-request/:request_id")
    .put(applicantController.cancelTravelRequest);

router.route("/create-expense-validation")
    .post(applicantController.createExpenseValidationHandler);

router.route("/get-completed-requests/:id")
    .get(applicantController.getCompletedRequests);

router.route("/get-user-request/:id")
    .get(applicantController.getApplicantRequest);

router.route("/get-user-requests/:id")
    .get(applicantController.getApplicantRequests);

export default router;
