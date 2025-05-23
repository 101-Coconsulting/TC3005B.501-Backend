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

const validateReceipt = async (req, res) => {
    const receiptId = req.params.receipt_id;
    const approval = req.body.approval;

    if (approval !== 0 && approval !== 1) {
        return res.status(400).json({
            error: "Invalid input (only values 0 or 1 accepted for approval)"
        });
    }

    try {
        // Check if receipt exists
        const receipt = await AccountsPayable.receiptExists(receiptId);
        if (!receipt){
            return res.status(404).json({ error: "Receipt not found" });
        }

        //Check if the receipt was already validated
        console.log("Receipt Validation: ", receipt.validation);

        if(receipt.validation != "Pendiente"){
            return res.status(404).json({ error: "Receipt already approved or rejected" });
        }

        // Update request status to 5
        const updated = await AccountsPayable.validateReceipt(receiptId);
        
        if(!updated){
            return res
                .status(400)
                .json({ error: "Failed to update travel request status" });
        }
        
        if (approval == 0){
            return res.status(200).json({
                summary: "Receipt rejected",
                value: {
                    receipt_id: receiptId,
                    new_status: "Rechazado",
                    message: "Receipt has been rejected." 
                }
            });
        }
        else if (approval == 1){
            return res.status(200).json({
                summary: "Receipt approved",
                value: {
                    receipt_id: receiptId,
                    new_status: "Aprobado",
                    message: "Receipt has been approved." 
                }
            });
        }
        
    } catch (err) {
        console.error("Error in attendTravelRequest controller:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// exports for the router
export default {
    attendTravelRequest,
    validateReceipt
};
