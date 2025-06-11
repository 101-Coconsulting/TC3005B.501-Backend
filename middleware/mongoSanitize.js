/*
 * Miguel Soria 10/06/25
 * middleware to sanitize mongoDB inputs
 */
import sanitize from 'mongo-sanitize';

// Middleware to sanitize request parameters, query, and body
export const sanitizeMongoInputs = (req, res, next) => {
  // Sanitize request parameters
  if (req.params) {
    req.params = sanitize(req.params);
  }

  // Sanitize request query
  if (req.query) {
    req.query = sanitize(req.query);
  }

  // Sanitize request body
  if (req.body) {
    req.body = sanitize(req.body);
  }

  next();
};
