/*
CPP Controller
Miguel Soria 09.05/25
Manages parameters and checks for CPP endpoints
*/
import AccountsPayable from "../models/accountsPayableModel.js";
import AccountsPayableService from '../services/accountsPayableService.js';

const attendTravelRequest = async (req, res) => {
    const requestId = req.params.request_id;
    const imposedFee = req.body.imposed_fee;

    try {
        // Check if request exists
        const request = await AccountsPayable.requestExists(requestId);
        if (!request) {
            return res.status(404).json({ error: "Travel request not found" });
        }

        const current_status = request.request_status_id;

        //Validate if this request can be attended by cpp
        if (current_status == 4){
           var new_status = 6;
           const hotel = request.hotel_needed_list;
           const plane = request.plane_needed_list;

           //If a hotel or plane is needed, send request to Travel Agency
           if (hotel.includes(1) || plane.includes(1)){
            new_status = 5;
           }

            const updated = await AccountsPayable.attendTravelRequest(requestId, imposedFee, new_status);

            if (updated) {
                return res.status(200).json({
                    message: "Travel request status updated successfully",
                    requestId: requestId,
                    imposedFee: imposedFee,
                    newStatus: new_status, // Atencion Agencia de Viajes
                });
            } else {
                return res
                    .status(400)
                    .json({ error: "Failed to update travel request status" });
            } 
        }
        else{
            res.status(404).json({ error: "This request cannot be attended by accounts payable" });
        }
    } catch (err) {
        console.error("Error in attendTravelRequest controller:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const validateReceiptsHandler = async (req, res) => {
    const requestId = req.params.request_id;

    try {
        const result = await AccountsPayableService.validateReceiptsAndUpdateStatus(requestId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error in validateReceiptsHandler:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// exports for the router
export default {
    attendTravelRequest,
    validateReceiptsHandler,
    
};
