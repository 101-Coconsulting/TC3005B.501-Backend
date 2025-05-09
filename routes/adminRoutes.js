/*
Admin Routes
*/
import express from "express";
import adminController from "../controllers/adminController.js";
const router = express.Router();

import { getUserList } from "../controllers/adminController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(getUserList);
router.route('/create-user')
    .post(adminController.createUser);

export default router;