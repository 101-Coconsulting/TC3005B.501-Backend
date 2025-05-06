  import Applicant from "../models/applicantModel.js";

  export async function createExpenseValidationBatch(receipts) {
    if (!Array.isArray(receipts) || receipts.length === 0) {
      const err = new Error('The "receipts" field must be a non-empty array');
      err.code = 'BAD_REQUEST';
      throw err;
    }

    const insertedCount = await Applicant.createExpenseBatch(receipts);
    return insertedCount;
  }