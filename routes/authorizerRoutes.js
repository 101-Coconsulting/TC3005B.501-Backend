    /*
    User Routes
    */
    import express from "express";
    const router = express.Router();

    import authorizerController from "../controllers/authorizerController.js";

    router.use((req, res, next) => {
        next();
    });

    router.route("/authorize-travel-request/:id")
        .get(authorizerController.authorizeTravelRequest);

    export default router;