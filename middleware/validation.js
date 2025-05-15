import { application } from 'express';
import { body, param, validationResult } from 'express-validator';

/*
 * This will validate the field of user id, given in any endpoint
 * (LuisDa)
 */
const validateUserId = [

];

/*
 * This will validate the fields in the Travel Request
 * (Sosa)
 */
const validateTravelRequest = [
  body(['user_id'].isNumeric().notEmpty().withMessage('Id must be a valid number')),
  body(['request_status_id'].isNumeric().notEmpty().withMessage('Request Id must be a valid number')),

  body(['requested_fee'].isFloat({min: 0}).notEmpty().withMessage('The minimum requested fee is 0')),
  body(['imposed_fee'].isFloat({min: 0}).notEmpty().withMessage('The minimum imposed fee is 0')),
  
  body(['origin_country_name'].isString().notEmpty().withMessage('Origin country must not be left empty.')),
  body(['origin_city_name'].isString().notEmpty().withMessage('Origin city must not be left empty.')),
  body(['destination_country_name'].isString().notEmpty().withMessage('Destination country must not be left empty.')),
  body(['destination_city_name'].isString().notEmpty().withMessage('Destination city must not be left empty.')),

  body(['beginning_date'].isString().notEmpty().withMessage('Trip start date cannot be empty.')),
  body(['beginning_time'].isString().notEmpty().withMessage('Trip start time cannot be empty.')),
  body(['ending_date'].isString().notEmpty().withMessage('Trip end date cannot be empty.')),
  body(['ending_time'].isString().notEmpty().withMessage('Trip end time cannot be empty.')),

  body(['plane_needed'].isBoolean().notEmpty().withMessage('Please select if plane reservation is required or not.')),
  body(['hotel_needed'].isBoolean().notEmpty().withMessage('Please select if hotel reservation is required or not.'))
]

/*
 * This will validate the receipts as they are created
 * (LuisDa)
 */
const validateExpenseReceipts = [

];

/*
 * This will validate the fields received in when declining or accepting a request
 * (Sosa)
 */

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
  validateAuthorizer,
  validateInputs
};
