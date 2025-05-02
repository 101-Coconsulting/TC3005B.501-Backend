/*
Applicant Controller
*/
import Applicant from "../models/applicantModel.js";
import { createExpenseValidationBatch } from "../services/applicantService.js";

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
    const id = req.params.id;
    try {
        const applicantRequests = await Applicant.getApplicantRequests(id);

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
    const id = req.params.id;
    try {
        const requestData = await Applicant.getApplicantRequest(id);
        if (!requestData || requestData.length === 0) {
            return res.status(404).json({ error: "No user request found" });
        }

        const baseData = requestData[0];

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
                user_email: baseData.user_email,
                user_phone_number: baseData.user_phone_number,
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

const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
};

export default {
    getApplicantById,
    getApplicantRequests,
    getApplicantRequest,
    createExpenseValidationHandler,
};

