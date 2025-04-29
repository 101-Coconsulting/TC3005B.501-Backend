/*
Applicant Controller
*/
import Applicant from "../models/applicantModel.js";
import { createExpenseValidationBatch } from '../services/applicantService.js';

export const getApplicantById = async (req, res) => {
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

export default {
    getApplicantById,
    createExpenseValidationHandler,
};