export const validateTravelRequest = [
  param('id').isNumeric().withMessage("ID must be a valid number").bail(),

  body('router_index').optional().isInt({ min: 0 }).withMessage('Router index must be a valid number').bail(),
  body('notes').optional().isString().trim().escape().stripLow().withMessage('Notes have to be a string').bail(),

  body('requested_fee').optional().isFloat({min: 0}).exists().withMessage('The minimum requested fee is 0').bail(),
  body('imposed_fee').optional().isFloat({min: 0}).exists().withMessage('The minimum imposed fee is 0').bail(),
  
  body('origin_country_name').optional().isString().trim().notEmpty().withMessage('Origin country cannot be empty.').bail(),
  body('origin_city_name').optional().isString().trim().notEmpty().withMessage('Origin city cannot be left empty.').bail(),
  body('destination_country_name').optional().isString().trim().notEmpty().withMessage('Destination country cannot be left empty.').bail(),
  body('destination_city_name').optional().isString().trim().notEmpty().withMessage('Destination city cannot be left empty.').bail(),

  body('beginning_date').optional().isString().trim().notEmpty().toDate().withMessage('Trip start date cannot be empty.').bail(),
  body('beginning_time').optional().isString().trim().notEmpty().withMessage('Trip start time cannot be empty.').bail(),
  body('ending_date').optional().isString().trim().notEmpty().toDate().withMessage('Trip end date cannot be empty.').bail(),
  body('ending_time').optional().isString().trim().notEmpty().withMessage('Trip end time cannot be empty.').bail(),

  body('plane_needed').optional().toBoolean().isBoolean().exists().withMessage('Please select if plane reservation is required or not.').bail(),
  body('hotel_needed').optional().toBoolean().isBoolean().exists().withMessage('Please select if hotel reservation is required or not.').bail(),

  body('additionalRoutes').optional().isArray().withMessage('Additional routes must be an array').bail(),
  body('additionalRoutes.*.router_index').optional().isNumeric().exists().withMessage("Router index must be a valid number").bail(),
  body('additionalRoutes.*.origin_country_name').optional().isString().trim().notEmpty().withMessage('Origin country cannot be empty.').bail(),
  body('additionalRoutes.*.origin_city_name').optional().isString().trim().notEmpty().withMessage('Origin city cannot be left empty.').bail(),
  body('additionalRoutes.*.destination_country_name').optional().isString().trim().notEmpty().withMessage('Destination country cannot be left empty.').bail(),
  body('additionalRoutes.*.destination_city_name').optional().isString().trim().notEmpty().withMessage('Destination city cannot be left empty.').bail(),

  body('additionalRoutes.*.beginning_date').optional().isString().trim().notEmpty().toDate().withMessage('Trip start date cannot be empty.').bail(),
  body('additionalRoutes.*.beginning_time').optional().isString().trim().notEmpty().withMessage('Trip start time cannot be empty.').bail(),
  body('additionalRoutes.*.ending_date').optional().isString().trim().notEmpty().toDate().withMessage('Trip end date cannot be empty.').bail(),
  body('additionalRoutes.*.ending_time').optional().isString().trim().notEmpty().withMessage('Trip end time cannot be empty.').bail(),

  body('additionalRoutes.*.plane_needed').optional().toBoolean().isBoolean().exists().withMessage('Please select if plane reservation is required or not.').bail(),
  body('additionalRoutes.*.hotel_needed').optional().toBoolean().isBoolean().exists().withMessage('Please select if hotel reservation is required or not.').bail(),
];