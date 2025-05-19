/*
CPP Controller
Miguel Soria 09.05/25
Manages parameters and checks for CPP endpoints
*/
import AccountsPayable from "../models/accountsPayableModel.js";

const attendTravelRequest = async (req, res) => {
    const requestId = req.params.request_id;
    const imposedFee = req.body.imposed_fee;

    try {
        // Check if request exists
        const exists = await AccountsPayable.requestExists(requestId);
        if (!exists) {
            return res.status(404).json({ error: "Travel request not found" });
        }

        const updated = await AccountsPayable.attendTravelRequest(requestId, imposedFee);

        if (updated) {
            return res.status(200).json({
                message: "Travel request status updated successfully",
                requestId: requestId,
                imposedFee: imposedFee,
                newStatus: 5, // Atencion Agencia de Viajes
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
