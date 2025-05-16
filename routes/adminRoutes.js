/*
Admin Routes
*/
import express from "express";
const router = express.Router();

import { getUserList } from "../controllers/adminController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(getUserList);

export default router;