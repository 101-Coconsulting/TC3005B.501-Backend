/*
Applicant Controller
*/
import Applicant from "../models/applicantModel.js";

const getApplicantById = async (req, res) => {
    const id = req.params.id;
    try {
        const applicant = await Applicant.findById(id);
        if (!applicant) {
            return res.status(404).json({error: "Applicant not found"});
        }
        const applicantWithId = {
            id: applicant.id,
            name: applicant.name
        };
        res.json(applicantWithId);
    } catch(err) {
        res.status(500).json({error: "Controller: Internal Server Error"});
    }
}

const getApplicantRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const requestData = await Applicant.getApplicantRequest(id);
        if (!requestData || requestData.length == 0) {
            return res.status(404).json({error: "No user request found"});
        }
        const baseData = requestData[0];

        const response = {
        request_id: baseData.request_id,
        request_status_id: baseData.request_status_id,
        notes: baseData.notes,
        requested_fee: baseData.requested_fee,
        imposed_fee: baseData.imposed_fee,
        creation_date: baseData.creation_date,
        last_mod_date: baseData.last_mod_date,
        user_name: baseData.user_name,
        email: baseData.email,
        phone_number: baseData.phone_number,
        routes: requestData.map(row => ({
            id_origin_country: row.id_origin_country,
            id_origin_city: row.id_origin_city,
            id_destination_country: row.id_destination_country,
            id_destination_city: row.id_destination_city,
            beginning_date: row.beginning_date,
            beginning_time: row.beginning_time,
            ending_date: row.ending_date,
            ending_time: row.ending_time,
            hotel_needed: row.hotel_needed,
            plane_needed: row.plane_needed
        }))
        };
        res.json(response);
    } catch(err) {
        console.error("Error en getApplicantRequest controller:", err);
        res.status(500).json({error: "CONTROLLER: Internal server error"});
    }
}


export default {
    getApplicantById,
    getApplicantRequest,
    // other functions go here
};