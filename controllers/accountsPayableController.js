/*
CPP Controller
Miguel Soria 09.05/25
Manages parameters and checks for CPP endpoints
*/
import AccountsPayable from "../models/accountsPayableModel.js";

const attendTravelRequest = async (req, res) => {
    const requestId = req.params.id;

    try {
        // Check if request exists
        const exists = await AccountsPayable.requestExists(requestId);
        if (!exists) {
            return res.status(404).json({ error: "Travel request not found" });
        }

        // Update request status to 5
        const updated = await AccountsPayable.attendTravelRequest(requestId);

        if (updated) {
            return res.status(200).json({
                message: "Travel request status updated successfully",
                requestId: requestId,
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

const getExpenseValidations = async (req, res) => {
    const request_id = Number(req.params.request_id);
    const status = req.params.status;

    console.log("Request ID:", request_id);
    console.log("Status:", status);

    try {
        // Check if request exists
        const exists = await AccountsPayable.requestExists(request_id);
        if (!exists) {
            return res.status(404).json({ error: "Travel request not found" });
        }

        // Get expense validations
        const validations = await AccountsPayable.getExpenseValidations(
            request_id,
            status
        );

        if (validations) {
            return res.status(200).json(validations);
        } else {
            return res
                .status(400)
                .json({ error: "Failed to retrieve expense validations" });
        }
    } catch (err) {
        console.error("Error in getExpenseValidations controller:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// exports for the router
export default {
    attendTravelRequest,
    getExpenseValidations,
};
