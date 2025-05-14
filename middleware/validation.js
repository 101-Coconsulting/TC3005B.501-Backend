import { body, param, validationResult } from 'express-validator';

const validateId = [

];

const validateUserId = [

];

const validateTravelRequest = [

];

const validateExpenseReceipts = [

;]

const validateAuthorizer = [

];

const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors.array() }); 
  }
  next();
};

export default {
  validateId,
  validateUserId,
  validateTravelRequest,
  validateExpenseReceipts,
  validateAuthorizer
  validateInputs
};

