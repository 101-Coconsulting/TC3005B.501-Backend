/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";

const getTravelRequest = async (req, res) => {
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
            status : travelRequest.status,
            notes : travelRequest.notes,
            requested_fee : travelRequest.requested_fee,
            imposed_fee : travelRequest.imposed_fee,
            request_date : travelRequest.creation_date,
            user : 
                {user_name : travelRequest.user_name,
                user_email : travelRequest.user_email,
                user_phone_number : travelRequest.user_phone_number},
            routes : 
                {origin_country : travelRequest.origin_countries,
                origin_city : travelRequest.origin_cities,
                destination_country : travelRequest.destination_countries,
                destination_city : travelRequest.destination_cities,
                beginning_date : travelRequest.beginning_dates,
                beginning_time : travelRequest.beginning_times,
                ending_date : travelRequest.ending_dates,
                ending_time : travelRequest.ending_times,
                hotel_needed : travelRequest.hotel_needed_list,
                plane_needed : travelRequest.plane_needed_list}  
        };
        res.json(formattedTravelRequest);
    } catch(err) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getTravelRequestsDept = async (req, res) => {
    const dept = parseInt(req.params.dept, 10);
    const status = parseInt(req.params.status, 10);
    const n = parseInt(req.params.n, 10);
    if (!Number.isInteger(dept)) {
        return res.status(400).json({error : "Invalid department"});
    }
    if (!Number.isInteger(status)) {
        return res.status(400).json({error : "Invalid status"});
    }
    if (!Number.isInteger(n)) {
        return res.status(400).json({error : "Invalid number"});
    }
    try {
        const travelRequests = await Authorizer.getTravelRequestsDept(dept, status, n);
        if (!travelRequests) {
            return res.status(404).json({error: "No travel requests found"});
        }
        const formattedTravelRequests = travelRequests.map(travelRequest => ({
            request_id: travelRequest.request_id,
            user_id: travelRequest.user_id,
            destination_country: travelRequest.destination_countries,
            beginning_date : travelRequest.beginning_dates,
            ending_date : travelRequest.ending_dates,
            status: travelRequest.status,
            
        }));
        res.status(200).json(formattedTravelRequests);
    } catch(err) {
        res.status(500).json({error: "Internal Server error"});
    }
}

const getAlerts = async (req, res) => {
    const id = Number(req.params.dept_id);
    const status = Number(req.params.status_id);
    const n = Number(req.params.n);
    try {
      const userRequest = await Authorizer.getAlerts(id, status, n);
      if (!userRequest) {
        return res.status(404).json({error: "Not found"});
      }
      return res.status(200).json(userRequest);
    } catch (error) {
      return res.status(400).json({error: "Bad Request"});
    }
  }

export default {
    getTravelRequest,
    getTravelRequestsDept,
    getAlerts
}