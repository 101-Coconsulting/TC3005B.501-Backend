import { body, param, validationResult } from 'express-validator';

/*
 * This will validate the field of user id, given in any endpoint
 * (LuisDa)
 */
export const validateId = [
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
  param('dept_id').isNumeric().withMessage('Department cannot be empty.'),
  param('status_id').isNumeric().withMessage('Status cannot be empty.'),
  param('n').optional().isNumeric().withMessage('N must be a valid number')
];

/*
 * This will validate the fields in the Travel Request
 * (Sosa)
 */
export const validateTravelRequest = [
  param('id').isNumeric().withMessage("ID must be a valid number").bail(),

  body('router_index').isInt({ min: 0 }).withMessage('Router index must be a valid number').bail(),
  body('notes').isString().trim().escape().stripLow().withMessage('Notes have to be a string').bail(),

  body('requested_fee').isFloat({min: 0}).exists().withMessage('The minimum requested fee is 0').bail(),
  body('imposed_fee').isFloat({min: 0}).exists().withMessage('The minimum imposed fee is 0').bail(),
  
  body('origin_country_name').isString().trim().notEmpty().withMessage('Origin country cannot be empty.').bail(),
  body('origin_city_name').isString().trim().notEmpty().withMessage('Origin city cannot be left empty.').bail(),
  body('destination_country_name').isString().trim().notEmpty().withMessage('Destination country cannot be left empty.').bail(),
  body('destination_city_name').isString().trim().notEmpty().withMessage('Destination city cannot be left empty.').bail(),

  body('beginning_date').isString().trim().notEmpty().toDate().withMessage('Trip start date cannot be empty.').bail(),
  body('beginning_time').isString().trim().notEmpty().withMessage('Trip start time cannot be empty.').bail(),
  body('ending_date').isString().trim().notEmpty().toDate().withMessage('Trip end date cannot be empty.').bail(),
  body('ending_time').isString().trim().notEmpty().withMessage('Trip end time cannot be empty.').bail(),

  body('plane_needed').toBoolean().isBoolean().exists().withMessage('Please select if plane reservation is required or not.').bail(),
  body('hotel_needed').toBoolean().isBoolean().exists().withMessage('Please select if hotel reservation is required or not.').bail(),

  body('additionalRoutes').optional().isArray().withMessage('Additional routes must be an array').bail(),
  body('additionalRoutes.*.router_index').isNumeric().exists().withMessage("Router index must be a valid number").bail(),
  body('additionalRoutes.*.origin_country_name').isString().trim().notEmpty().withMessage('Origin country cannot be empty.').bail(),
  body('additionalRoutes.*.origin_city_name').isString().trim().notEmpty().withMessage('Origin city cannot be left empty.').bail(),
  body('additionalRoutes.*.destination_country_name').isString().trim().notEmpty().withMessage('Destination country cannot be left empty.').bail(),
  body('additionalRoutes.*.destination_city_name').isString().trim().notEmpty().withMessage('Destination city cannot be left empty.').bail(),

  body('additionalRoutes.*.beginning_date').isString().trim().notEmpty().toDate().withMessage('Trip start date cannot be empty.').bail(),
  body('additionalRoutes.*.beginning_time').isString().trim().notEmpty().withMessage('Trip start time cannot be empty.').bail(),
  body('additionalRoutes.*.ending_date').isString().trim().notEmpty().toDate().withMessage('Trip end date cannot be empty.').bail(),
  body('additionalRoutes.*.ending_time').isString().trim().notEmpty().withMessage('Trip end time cannot be empty.').bail(),

  body('additionalRoutes.*.plane_needed').toBoolean().isBoolean().exists().withMessage('Please select if plane reservation is required or not.').bail(),
  body('additionalRoutes.*.hotel_needed').toBoolean().isBoolean().exists().withMessage('Please select if hotel reservation is required or not.').bail(),
];

/*
 * This will validate the receipts as they are created
 * (LuisDa)
 */
export const validateExpenseReceipts = [
  body('receipts').isArray().notEmpty().withMessage('Receipts must be a non-empty array.'),
  body('receipts.*.receipt_type_id').isInt({ min: 0 }).withMessage('Receipt type ID must be a valid number'),
  body('receipts.*.request_id').isInt({ min: 0 }).withMessage('Request ID must be a valid number'),
  body('receipts.*.amount').isFloat({ min: 0 }).withMessage('Amounts needs to be a valid number'),
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
  validateId,
  validateTravelRequest,
  validateExpenseReceipts,
  validateInputs
};
