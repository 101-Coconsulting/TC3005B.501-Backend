/*
Travel Agent Controller
Miguel Soria 26/04/25
Manages parameters and checks for Travel Agent endpoints
*/
import TravelAgent from "../models/travelAgentModel.js";
import Authorizer from "../models/authorizerModel.js";

const attendTravelRequest = async (req, res) => {
    const requestId = req.params.id;
    const user_id = req.body.user_id;

    try {
        // Check if request exists
        const exists = await TravelAgent.requestExists(requestId);
        if (!exists) {
            return res.status(404).json({ error: "Travel request not found" });
        }

        //Check if user exists
        //Check if user exists
        const role_id = await Authorizer.getUserRole(user_id);
        if (!role_id) {
            throw { status: 404, message: "User not found" };
        }

        // Update request status to 5
        const updated = await TravelAgent.attendTravelRequest(requestId, user_id);

        if (updated) {
            return res.status(200).json({
                message: "Travel request status updated successfully",
                requestId: requestId,
                newStatus: 6, // Comprobación Estado de Viaje
            });
        } else {
            return res
                .status(400)
                .json({ error: "Failed to update travel request status" });
        }
    } catch (err) {
        console.error("Error in attendTravelRequest controller:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// exports for the router
export default {
    attendTravelRequest,
};
