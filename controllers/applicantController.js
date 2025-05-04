/*
Applicant Controller
*/
import Applicant from "../models/applicantModel.js";
import { cancelTravelRequestValidation, createExpenseValidationBatch } from '../services/applicantService.js';

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

/**
 * Handles POST /create-expense-validation
 * Expects: { receipts: [ { receipt_type_id, request_id }, … ] }
 */
export async function createExpenseValidationHandler(req, res) {
    try {
      const count = await createExpenseValidationBatch(req.body.receipts);
      return res.status(201).json({
        count,
        message: 'Expense receipts created successfully'
      });
    } catch (err) {
      if (err.code === 'BAD_REQUEST') {
        return res.status(400).json({ error: err.message });
      }
      console.error('Error in createReceiptsBatchHandler:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

export const getCompletedRequests = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    try {
        const completedRequests = await Applicant.getCompletedRequests(id);
        if (!completedRequests ||  completedRequests.length === 0) {
            return res.status(404).json({error: "No completed requests found for the user"});
        }
        const formattedRequests = completedRequests.map(request => ({
            request_id: request.request_id,
            destination_country: request.destination_countries,
            destination_city: request.destination_cities,
            beginning_date: request.beginning_dates,
            ending_date: request.ending_date,
            request_date: request.creation_date,
            status: request.status
          }));
        res.json(formattedRequests);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    }
}

export default {
  getApplicantById,
  getCostCenterByUserId,
  createTravelRequest,
  cancelTravelRequest,
  getCompletedRequests,
  createExpenseValidationHandler
};
