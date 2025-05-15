import { body, param, validationResult } from 'express-validator';

/*
 * This will validate the field of user id, given in any endpoint
 * (LuisDa)
 */
const validateUserId = [
  param(['id', 'user_id']).isNumeric().withMessage('The ID needs to be a valid number');
];

/*
 * This will validate the fields in the Travel Request
 * (Sosa)
 */
const validateTravelRequest = [

];

/*
 * This will validate the receipts as they are created
 * (LuisDa)
 */
const validateExpenseReceipts = [

];

/*
 * This reviews any errors received in previous validations
 */
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
  validateInputs
};
