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
const validateTravelRequest = validationRequest => {
  return async (req, res, next) => {
    for (const validation of validationRequest) {
      const result = await validation.run(req);
      if(!result.isEmpty()){
        return res.status(400).json({errors: result.array()});
      }
    }

    next();
  };
};

app.post('/create-travel-request/:id', validateTravelRequest([
  body('router_index').isInt(),
  body('notes').isString(),
  body('requested_fee').isString({min: 0}),
  body('imposed_fee').isInt({min: 0}),
  body('origin_country_name').isString(),
  body('origin_city_name').isString(),
  body('destination_country_name').isString(),
  body('beginning_date').isString(),
  body('beginning_time').isString(),
  body('ending_date').isString(),
  body('eding_time').isString(),
  body('plane_needed').isBoolean(),
  body('hotel_needed').isBoolean()
]));

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
const validateAuthorizer = [

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
  validateAuthorizer,
  validateInputs
};
