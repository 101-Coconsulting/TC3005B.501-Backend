/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";
import authorizerServices from "../services/authorizerService.js";

const authorizeTravelRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const idRequest = await authorizerServices.getRequestStatusId(id);

        const userRequest = await Authorizer.authorizeTravelRequest(id, idRequest);
        if (!userRequest) {
            return res.status(404).json({error: "No user request found"});
        }
        return res.status(200).json({ message: "Request authorized successfully" });
    } catch(err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        console.error("Error inesperado:", err);
        return res.status(500).json({ error: "CONTROLLER: Internal server error" });
    }
}

const declineTravelRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const userRequest = await Authorizer.declineTravelRequest(id);
        if (!userRequest) {
            return res.status(404).json({ error: "No user request found" });
        }
        return res.status(200).json({ message: "Request declined successfully" });
    } catch (err) {
        console.error("Error en declineTravelRequest:", err);
        return res.status(500).json({ error: "CONTROLLER: Internal server error" });
    }
}

export default {
    authorizeTravelRequest,
    declineTravelRequest,
    // other functions go here
};