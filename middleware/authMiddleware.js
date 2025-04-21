
/**
 * Token authentication middleware
 * Validates the authentication token from the request
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export function tokenAuth(req, res, next) {
  // TODO: Implement token validation
  // This is a placeholder for the actual token validation logic
  // In a real implementation, you would:
  // 1. Extract the token from Authorization header or request
  // 2. Verify the token's authenticity (using JWT or other method)
  // 3. Attach the decoded user information to req.user
  // 4. Call next() if valid, or return 401 if invalid

  const authHeader = req.headers.authorization;

  // Check if auth header exists
  if (!authHeader) {
    return res.status(401).json({
      error: 'Missing authentication token',
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Format of token: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Invalid token format',
        message: 'Token must be in format: Bearer <token>'
      });
    }

    const token = parts[1];

    // Verify token (uncomment when jwt is installed)
    // In production, JWT_SECRET should be in environment variables
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // For development only - mock token verification
    // TODO: Replace with actual JWT verification in production
    const mockDecode = (token) => {
      try {
        // This is just a placeholder to simulate the structure
        if (!token || token === 'invalid') {
          throw new Error('Invalid token');
        }

        // Return mock user data (in production, this would come from the verified token)
        return {
          userId: 1,
          role: 'Administrator',
          exp: Date.now() + 3600000 // 1 hour from now
        };
      } catch (error) {
        throw new Error('Token verification failed');
      }
    };

    const decoded = mockDecode(token);

    // Check if token is expired
    if (decoded.exp < Date.now()) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Your authentication token has expired. Please log in again.'
      });
    }

    // Add user info to request object
    req.user = decoded;

    // Token is valid, proceed
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'The provided authentication token is invalid or has been tampered with.'
    });
  }
}

/**
 * Role-based authorization middleware
 * Checks if the authenticated user has the required role(s)
 *
 * @param {string|string[]} roles - Required role(s) to access the route
 * @returns {Function} Middleware function
 */
export function authorize(roles) {
  // Convert single role to array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // First ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource'
      });
    }

    // User has required role, proceed
    next();
  };
}

/**
 * Self or admin check middleware
 * Allows access if the user is requesting their own data or is an admin
 *
 * @param {string} userIdParam - The name of the request parameter containing the user ID
 * @returns {Function} Middleware function
 */
export function selfOrAdmin(userIdParam = 'user_id') {
  return (req, res, next) => {
    // First ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    const targetUserId = parseInt(req.params[userIdParam]);

    // If user is admin or requesting their own data, allow access
    if (req.user.role === 'Administrator' || req.user.userId === targetUserId) {
      return next();
    }

    // Otherwise, deny access
    return res.status(403).json({
      error: 'Incorrect permissions',
      message: 'You do not have permission to access this user data'
    });
  };
}
