/*
Admin Routes
*/
import express from "express";
import multer from "multer";
const router = express.Router();

// Import the default export
import adminController from "../controllers/adminController.js"; // Add .js extension for ES modules

const uplaod = multer({
    dest: "uploads/"
});

router.use((req, res, next) => {
    next();
});

router.route("/create-multiple-users")
    .post(
        uplaod.single("file"),
        adminController.createMultipleUsers // Access the function from the imported object
    );

export default router;
