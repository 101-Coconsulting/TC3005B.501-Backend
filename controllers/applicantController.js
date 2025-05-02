/*
Applicant Controller
*/
import Applicant from "../models/applicantModel.js";
import { cancelTravelRequestValidation } from '../services/applicantService.js';

const getApplicantById = async (req, res) => {
  const id = req.params.id;

  try {
    const applicant = await Applicant.findById(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }
    const applicantWithId = {
      user_id: applicant.user_id,
      user_name: applicant.user_name,
    };
    res.json(applicantWithId);
  } catch (err) {
    res.status(500).json({ error: "Controller: Internal Server Error" });
  }
};

const getCostCenterByUserId = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const costCenter = await Applicant.findCostCenterByUserId(user_id);
    if (!costCenter) {
      return res.status(404).json({
        error: `Cost center not found for user_id ${user_id}`,
        user_id,
      });
    }
    res.json(costCenter);
  } catch (err) {
    res.status(500).json({ error: "Controller: Internal Server Error" });
  }
};

const createTravelRequest = async (req, res) => {
  const applicantId = Number(req.params.id);
  const travelDetails = req.body;
  try {
    const travelRequest = await Applicant.createTravelRequest(
      applicantId,
      travelDetails,
    ); // <-- usa Applicant
    res.status(201).json(travelRequest);
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ error: "Controller: Internal Server Error" });
  }
};

export const cancelTravelRequest = async (req, res) => {
  const { request_id } = req.params;

  try {
    const result = await cancelTravelRequestValidation(Number(request_id));
    return res.status(200).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Unexpected error in cancelTravelRequest controller:", err);
    return res.status(500).json({ error: "Unexpected error while cancelling request" });
  }
};

export default {
  getApplicantById,
  getCostCenterByUserId,
  createTravelRequest,
  cancelTravelRequest,

};