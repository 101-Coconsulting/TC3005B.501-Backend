/*
Admin Routes
*/
import express from "express";
import multer from "multer";
const router = express.Router();
import * as adminController from "../controllers/adminController.js"; // Add .js extension for ES modules
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { validateCreateUser, validateInputs } from "../middleware/validation.js";
import { generalRateLimiter } from "../middleware/rateLimiters.js";

const upload = multer({
    dest: "uploads/"
});

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(generalRateLimiter, authenticateToken, authorizeRole(['Administrador']), adminController.getUserList);

router.route('/create-user')
    .post(generalRateLimiter, authenticateToken, authorizeRole(['Administrador']), validateCreateUser, validateInputs, adminController.createUser);

router.route("/create-multiple-users")
    .post(
        generalRateLimiter,
        authenticateToken, authorizeRole(['Administrador']),
        upload.single("file"),
        adminController.createMultipleUsers
    );

router.route("/delete-user/:user_id")
    .put(adminController.deactivateUser);

export default router;
