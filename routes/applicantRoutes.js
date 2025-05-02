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

router
  .route("/create-travel-request/:id")
  .post(applicantController.createTravelRequest);

router.route("/cancel-travel-request/:request_id")
    .put(applicantController.cancelTravelRequest);

export default router;