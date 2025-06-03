/*
Admin Routes
*/
import express from "express";
import multer from "multer";
const router = express.Router();

import * as adminController from "../controllers/adminController.js"; // Add .js extension for ES modules
import { validateId, validateInputs } from "../middleware/validation.js";
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
    .post(adminController.createUser);
router.route("/create-multiple-users")
    .post(
        upload.single("file"),
        adminController.createMultipleUsers
    );

router.route('/update-user/:user_id')
    .put(putUser);

export default router;
