import { body, param, validationResult } from 'express-validator';

/*
 * This will validate the field of user id, given in any endpoint
 * (LuisDa)
 */
export const validateUserId = [
  param('id').optional().isNumeric().withMessage('The ID needs to be a valid number'),
  param('request_id').optional().isNumeric().withMessage('Request ID must be a valid number'),
  param('user_id').optional().isNumeric().withMessage('User ID must be a valid number'),
  (req, res, next) => {
    if (!req.params.id && !req.params.user_id && !req.params.request_id) {
      return res.status(400).json({ error: "At least one ID needs to be provided" });
    }
    next();
  }
];

export const validateDeptStatus = [
  param('dept').isNumeric().withMessage('Department cannot be empty.'),
  param('status').isNumeric().withMessage('Status cannot be empty.'),
  param('n').optional().isNumeric().withMessage('N must be a valid number')
];

/*
 * This will validate the fields in the Travel Request
 * (Sosa)
 */
export const validateTravelRequest = [
  body('user_id').isNumeric().exists().withMessage('User ID must be a valid number'),
  body('request_status_id').isNumeric().exists().withMessage('Request status ID must be a valid number'),

  body('requested_fee').isFloat({min: 0}).exists().withMessage('The minimum requested fee is 0'),
  body('imposed_fee').isFloat({min: 0}).exists().withMessage('The minimum imposed fee is 0'),
  
  body('origin_country_name').isString().trim().notEmpty().withMessage('Origin country cannot be empty.'),
  body('origin_city_name').isString().trim().notEmpty().withMessage('Origin city cannot be left empty.'),
  body('destination_country_name').isString().trim().notEmpty().withMessage('Destination country cannot be left empty.'),
  body('destination_city_name').isString().trim().notEmpty().withMessage('Destination city cannot be left empty.'),

  body('beginning_date').isString().trim().notEmpty().withMessage('Trip start date cannot be empty.'),
  body('beginning_time').isString().trim().notEmpty().withMessage('Trip start time cannot be empty.'),
  body('ending_date').isString().trim().notEmpty().withMessage('Trip end date cannot be empty.'),
  body('ending_time').isString().trim().notEmpty().withMessage('Trip end time cannot be empty.'),

  body('plane_needed').isBoolean().exists().withMessage('Please select if plane reservation is required or not.'),
  body('hotel_needed').isBoolean().exists().withMessage('Please select if hotel reservation is required or not.')
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
export const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
  }
  next();
};

export default {
  validateUserId,
  validateTravelRequest,
  validateExpenseReceipts,
  validateInputs
};
