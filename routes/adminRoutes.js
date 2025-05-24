/*
Admin Routes
*/
import express from "express";
const router = express.Router();
import { validateId, validateInputs } from "../middleware/validation.js";

import { getUserList } from "../controllers/adminController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(validateId, validateInputs, getUserList);

export default router;
