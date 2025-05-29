/*
Admin Routes
*/
import express from "express";
const router = express.Router();
import { validateId, validateInputs } from "../middleware/validation.js";

import { getUserList, putUser } from "../controllers/adminController.js";

router.use((req, res, next) => {
    next();
});

router.route("/get-user-list")
    .get(validateId, validateInputs, getUserList);

router.route('/update-user/:user_id')
    .put(putUser);

export default router;
