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

export default router;