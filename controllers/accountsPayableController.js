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

const authorizeExpenseValidation = async (req, res) => {
    const { id: request_id, status_id } = req.params;
  
    try {
        console.log("Entro al try :D");
        const { new_status } = await AccountsPayable.authorizeExpenseValidation(Number(request_id), Number(status_id));
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
}

// exports for the router
export default {
    attendTravelRequest,
    authorizeExpenseValidation,
};
