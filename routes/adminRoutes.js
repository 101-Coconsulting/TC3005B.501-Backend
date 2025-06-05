/*
Admin Routes
*/
import express from "express";
import multer from "multer";
const router = express.Router();
import * as adminController from "../controllers/adminController.js"; // Add .js extension for ES modules
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { validateCreateUser } from "../middleware/validation.js";

const upload = multer({
    dest: "uploads/"
});

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(authenticateToken, authorizeRole(['Administrador']), adminController.getUserList);
router.route('/create-user')
    .post(validateCreateUser, adminController.createUser);
router.route("/create-multiple-users")
    .post(
        authenticateToken, authorizeRole(['Administrador']),
        upload.single("file"),
        adminController.createMultipleUsers
    );

export default router;
