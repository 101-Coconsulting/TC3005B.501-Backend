/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";
import authorizerServices from "../services/authorizerService.js";

const authorizeTravelRequest = async (req, res) => {
    const { id: request_id, user_id } = req.params;
  
    try {
      const { new_status } = await authorizerServices.authorizeRequest(Number(request_id), Number(user_id));
      return res.status(200).json({
        message: "Request status updated successfully",
        new_status
      });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ error: err.message });
      }
      console.error("Unexpected error in authorizeTravelRequest controller:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

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