/*
Applicant Routes
*/
import express from "express";
const router = express.Router();

import applicantController from "../controllers/applicantController.js";

router.use((req, res, next) => {
    next();
});

router.route("/:id")
    .get(applicantController.getApplicantById);

router.route("/get-user-requests/:id")
    .get(applicantController.getApplicantRequests);

export default router;