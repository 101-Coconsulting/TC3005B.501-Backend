/*
Admin Routes
*/
import express from "express";
const router = express.Router();
import { validateUserId, validateInputs } from "../middleware/validation.js";

import { getUserList } from "../controllers/adminController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(validateUserId, validateInputs, getUserList);

export default router;
