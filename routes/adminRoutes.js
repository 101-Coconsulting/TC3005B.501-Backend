/*
Admin Routes
*/
import express from "express";
import multer from "multer";
const router = express.Router();
import * as adminController from "../controllers/adminController.js"; // Add .js extension for ES modules
import { validateCreateUser } from "../middleware/validation.js";

import { getUserList, putUser } from "../controllers/adminController.js";

const upload = multer({
    dest: "uploads/"
});

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(adminController.getUserList);

router.route('/create-user')
    .post(validateCreateUser, adminController.createUser);

router.route("/create-multiple-users")
    .post(
        upload.single("file"),
        adminController.createMultipleUsers
    );

router.route('/update-user/:user_id')
    .put(putUser);

router.route("/delete-user/:user_id")
    .put(adminController.deactivateUser);

export default router;
