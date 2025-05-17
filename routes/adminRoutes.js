/*
Admin Routes
*/
import express from "express";
const router = express.Router();

import { getUserList, deactivateUser } from "../controllers/adminController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(getUserList);

router.route("/delete-user/:user_id")
    .patch(deactivateUser);

export default router;