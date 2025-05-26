import { body, param, validationResult } from 'express-validator';

/*
 * Sanitize inputs for ID params
 * (LuisDa)
 */
export const sanitizeIds = [

];

/*
 * Sanitize inputs for travel request 
 * (Sosa)
 */
export const sanitizeTravelRequest = [

];

/*
 * Sanitize inputs for expense receipts
 * (LuisDa)
 */
export const sanitizeExpenseReceipts = [

];


export const sanitizeInputs = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  next();
};

export default {
  sanitizeIds,
  sanitizeTravelRequest,
  sanitizeExpenseReceipts,
  sanitizeInputs
};
