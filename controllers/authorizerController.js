/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";

const getTravelRequest = async (req, res) => {
    console.log("Authorizer controller called");
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({error : "Invalid travel request ID"});
    }
    try {
        const travelRequest = await Authorizer.getTravelRequest(id);
        if (!travelRequest) {
            return res.status(404).json({error: "No travel request found"});
        }
        const formattedTravelRequest = {
            request_id : travelRequest.request_id,
            user_id : travelRequest.user_id,
            status : travelRequest.status,
            notes : travelRequest.notes,
            requested_fee : travelRequest.requested_fee,
            imposed_fee : travelRequest.imposed_fee,
            destination_countries : travelRequest.destination_countries,
            destination_cities : travelRequest.destination_cities,
            creation_date : travelRequest.creation_date,
            last_mod : travelRequest.last_mod_date,
            active : travelRequest.active
        };
        res.json(formattedTravelRequest);
    } catch(err) {
        res.status(500);
    }
}

export default {
    getTravelRequest
}