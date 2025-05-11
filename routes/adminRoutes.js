/*
Admin Routes
*/
import express from "express";
import * as adminController from "../controllers/adminController.js";
const router = express.Router();

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(adminController.getUserList);
router.route('/create-user')
    .post(adminController.createUser);

export default router;