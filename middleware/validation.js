import { application } from 'express';
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
  body(['user_id', 'request_status_id'].isNumeric().notEmpty().withMessage('Id must be a valid number')),
  body(['requested_fee', 'imposed_fee'].isFloat({min: 0}).notEmpty().withMessage('The minimum allowed fee is 0')),
  body(['origin_country_name', 'origin_city_name', 'destination_country_name', 'destination_city_name'].isString().notEmpty().withMessage('City and Country must not be empty')),
  body(['beginning_date', 'beginning_time', 'endind_date', 'ending_time'].isString().notEmpty().withMessage('Start and finish dates and times must not be empty')),
  body(['plane_needed', 'hotal_needed'].isBoolean().notEmpty().withMessage('Please select of either hotel or plane are needed'))
]

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
