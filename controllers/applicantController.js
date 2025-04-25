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
            user_id: applicant.user_id,
            user_name: applicant.user_name
        };
        res.json(applicantWithId);
    } catch(err) {
        res.status(500).json({error: "Controller: Internal Server Error"});
    }
}

const getCompletedRequests = async (req, res) => {
    const id = req.params.id;
    console.log(`Getting completed requests for id: ${id}`)
    try {
        const completedRequests = await Applicant.getCompletedRequests(id);
        if (!completedRequests) {
            return res.status(404).json({error: "No completed requests found for the user"});
        }
        const formattedRequests = completedRequests.map(request => ({
            request_id: request.request_id,
            destination_country: request.destination_country,
            request_date: request.request_date,
            status: request.status
          }));
        res.json(formattedRequests);
    } catch(err) {
        res.status(500).json({error: "CONTROLLER: Internal server error"});
    }
}

export default {
    getApplicantById,
    getCompletedRequests
    // other functions go here
};