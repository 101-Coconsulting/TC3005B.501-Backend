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

const getApplicantRequests = async (req, res) => {
    const id = req.params.id;
    try {
      const applicantRequests = await Applicant.getApplicantRequests(id);
  
      if (!applicantRequests || applicantRequests.length === 0) {
        return res.status(404).json({ error: "No user requests found" });
      }
  
      const formattedRequests = applicantRequests.map(request => ({
        request_id: request.request_id,
        destination_country: request.destination_country,
        beginning_date: formatDate(request.beginning_date),
        ending_date: formatDate(request.ending_date),
        status: request.status
      }));
  
      res.json(formattedRequests);
    } catch (err) {
      console.error("Error in getApplicantRequests controller:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };  

export default {
    getApplicantById,
    getApplicantRequests,
    // other functions go here
};