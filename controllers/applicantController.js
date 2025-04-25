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

const getCostCenterByUserId = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const costCenter = await Applicant.findCostCenterByUserId(user_id);
        if (!costCenter) {
            return res.status(404).json({
                error: `Cost center not found for user_id ${user_id}`,
                user_id
            });
        }
        res.json(costCenter);
    } catch (err) {
        res.status(500).json({ error: "Controller: Internal Server Error" });
    }
}

export default {
    getApplicantById,
    getCostCenterByUserId,
    // other functions go here
};