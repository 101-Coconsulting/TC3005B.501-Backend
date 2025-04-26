/*
Applicant Controller
*/
import { Applicant } from "../models/applicantModel.js";

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

const createTravelRequest = async (req, res) => {
    const applicantId = Number(req.params.id);
    const travelDetails = req.body;
    try {
        const travelRequest = await Applicant.createTravelRequest(applicantId, travelDetails); // <-- usa Applicant
        res.status(201).json(travelRequest);
    } catch (err) {
        console.error('Controller error:', err);
        res.status(500).json({ error: "Controller: Internal Server Error" });
    }
};



export default {
    getApplicantById,
    createTravelRequest
    // other functions go here
};