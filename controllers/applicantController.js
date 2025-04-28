/*
Applicant Controller
*/
import Applicant from "../models/applicantModel.js";

const getApplicantById = async (req, res) => {
    const id = req.params.id;
    try {
        const applicant = await Applicant.findById(id);
        if (!applicant) {
            return res.status(404).json({ error: "Applicant not found" });
        }
        const applicantWithId = {
            user_id: applicant.user_id,
            user_name: applicant.user_name
        };
        res.json(applicantWithId);
    } catch (err) {
        res.status(500).json({ error: "Controller: Internal Server Error" });
    }
}


const editTravelRequest = async (req, res) => {
    const requestId = Number(req.params.request_id);
    const travelChanges = req.body;
    try {
        const travelChangesRequest = await Applicant.editTravelRequest(requestId, travelChanges);
        re.status(201).json(travelChangesRequest);
    } catch (error) {
        console.error("Error updating travel request:", error);
        res.status(500).json({ error: "Controller: Internal Server Error" });
    }
}

export default {
    getApplicantById,
    editTravelRequest
    // other functions go here
};