/*
Applicant Controller
*/
import Applicant from "../models/applicantModel.js";
import { cancelTravelRequestValidation, createExpenseValidationBatch, sendReceiptsForValidation } from '../services/applicantService.js';
import { decrypt } from '../middleware/decryption.js';
import { Mail } from "../services/email/mail.cjs";
import mailData from "../services/email/mailData.js";

export const getApplicantById = async (req, res) => {
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

export const getApplicantRequests = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const applicantRequests = await Applicant.getApplicantRequests(userId);

    if (!applicantRequests || applicantRequests.length === 0) {
      return res.status(404).json({ error: "No user requests found" });
    }

    const formattedRequests = applicantRequests.map((request) => ({
      request_id: request.request_id,
      destination_country: request.destination_country,
      beginning_date: formatDate(request.beginning_date),
      ending_date: formatDate(request.ending_date),
      status: request.status,
    }));

    res.json(formattedRequests);
  } catch (err) {
    console.error("Error in getApplicantRequests controller:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplicantRequest = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const requestData = await Applicant.getApplicantRequest(userId);
    if (!requestData || requestData.length === 0) {
      return res.status(404).json({ error: "No user request found" });
    }

    const baseData = requestData[0];
    const decryptedEmail = decrypt(baseData.user_email);
    const decryptedPhone = decrypt(baseData.user_phone_number);

    const response = {
      request_id: baseData.request_id,
      request_status: baseData.request_status,
      notes: baseData.notes,
      requested_fee: baseData.requested_fee,
      imposed_fee: baseData.imposed_fee,
      request_days: baseData.request_days,
      creation_date: formatDate(baseData.creation_date),
      user: {
        user_name: baseData.user_name,
        user_email: decryptedEmail,
        user_phone_number: decryptedPhone,
      },
      routes: requestData.map((row) => ({
        router_index: row.router_index,
        origin_country: row.origin_country,
        origin_city: row.origin_city,
        destination_country: row.destination_country,
        destination_city: row.destination_city,
        beginning_date: formatDate(row.beginning_date),
        beginning_time: row.beginning_time,
        ending_date: formatDate(row.ending_date),
        ending_time: row.ending_time,
        hotel_needed: row.hotel_needed,
        plane_needed: row.plane_needed,
      })),
    };

    res.json(response);
  } catch (err) {
    console.error("Error in getApplicantRequest controller:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCostCenterByUserId = async (req, res) => {
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

export const createTravelRequest = async (req, res) => {
  const applicantId = Number(req.params.user_id);
  const travelDetails = req.body;
  try {
    const travelRequest = await Applicant.createTravelRequest(
      applicantId,
      travelDetails,
    );
    const { user_email, user_name, requestId, status } = await mailData(travelRequest.requestId);
    await Mail(user_email, user_name, travelRequest.requestId, status);
    res.status(201).json(travelRequest);
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ error: "Controller: Internal Server Error" });
  }
};

export const editTravelRequest = async (req, res) => {
  const travelRequestId = Number(req.params.user_id);
  const travelDetails = req.body;
  try {
    const updatedTravelRequest = await Applicant.editTravelRequest(
      travelRequestId,
      travelDetails,
    );
    res.status(200).json(updatedTravelRequest);
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ error: "Controller: Internal Server Error" });
  }
};

export const cancelTravelRequest = async (req, res) => {
  const { request_id } = req.params;

  try {
    const result = await cancelTravelRequestValidation(Number(request_id));
    const { user_email, user_name, requestId, status } = await mailData(request_id);
    await Mail(user_email, user_name, request_id, status);
    return res.status(200).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Unexpected error in cancelTravelRequest controller:", err);
    return res.status(500).json({ error: "Unexpected error while cancelling request" });
  }
};

export async function createExpenseValidationHandler(req, res) {
  try {
    const count = await createExpenseValidationBatch(req.body.receipts);
    return res.status(201).json({
      count,
      message: "Expense receipts created successfully",
    });
  } catch (err) {
    if (err.code === "BAD_REQUEST") {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error in createExpenseValidationHandler:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const getCompletedRequests = async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const completedRequests = await Applicant.getCompletedRequests(userId);
    if (!completedRequests || completedRequests.length === 0) {
      return res.status(404).json({ error: "No completed requests found for the user" });
    }
    const formattedRequests = completedRequests.map(request => ({
      request_id: request.request_id,
      origin_country: request.origin_countries,
      destination_country: request.destination_countries,
      beginning_date: request.beginning_dates,
      ending_date: request.ending_dates,
      request_date: formatDate(request.creation_date),
      status: request.status
    }));
    res.json(formattedRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const createDraftTravelRequest = async (req, res) => {
  const applicantId = Number(req.params.user_id);
  const travelDetails = req.body;
  try {
    const travelRequest = await Applicant.createDraftTravelRequest(
      applicantId,
      travelDetails,
    );
    res.status(201).json(travelRequest);

  } catch (error) {
    console.error("Error in createDraftTravelRequest controller:", error);
    res.status(500).json({ error: "Internal server error" });

  }

}

const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

export const confirmDraftTravelRequest = async (req, res) => {

  const userId = Number(req.params.user_id);
  const requestId = Number(req.params.request_id);

  try {
    const result = await Applicant.confirmDraftTravelRequest(userId, requestId);
    const { user_email, user_name, request_id, status } = await mailData(requestId);
    await Mail(user_email, user_name, requestId, status);
    return res.status(200).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Unexpected error in confirmDraftTravelRequest controller:", err);
    return res.status(500).json({ error: "Unexpected error while confirming draft request" });
  }
};

export const sendExpenseValidation = async (req, res) => {
  const requestId = req.params.request_id;

  try {
    const result = await sendReceiptsForValidation(requestId);
    const { user_email, user_name, request_id, status } = await mailData(requestId);
    await Mail(user_email, user_name, requestId, status);
    return res.status(200).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Unexpected error in sendExpenseValidation controller:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteReceipt = async (req, res) => {
  const { receipt_id } = req.params;
  
  try {
    // Import the service to delete files from MongoDB
    const { deleteReceiptFiles } = await import('../services/receiptFileService.js');
    
    // First delete the files from MongoDB
    await deleteReceiptFiles(Number(receipt_id));
    
    // Then delete the receipt record from the database
    await Applicant.deleteReceipt(Number(receipt_id));
    
    return res.status(200).json({
      message: "Receipt deleted successfully",
      receipt_id: Number(receipt_id)
    });
  } catch (err) {
    if (err.message === 'Receipt not found') {
      return res.status(404).json({ error: "Receipt not found" });
    }
    console.error("Error in deleteReceipt controller:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export default {
  getApplicantById,
  getApplicantRequests,
  getApplicantRequest,
  getCostCenterByUserId,
  createTravelRequest,
  editTravelRequest,
  cancelTravelRequest,
  getCompletedRequests,
  createExpenseValidationHandler,
  createDraftTravelRequest,
  confirmDraftTravelRequest,
  sendExpenseValidation,
  deleteReceipt,
};
