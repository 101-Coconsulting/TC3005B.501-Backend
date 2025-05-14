import * as userService from '../services/userService.js';

/**
 * Get user data by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data
 */
export async function getUserData(req, res) {
  try {
    console.log('Request received for user ID:', req.params.user_id);
    const userId = parseInt(req.params.user_id);

    if (isNaN(userId)) {
      console.log('Invalid user ID format');
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const userData = await userService.getUserById(userId);
    console.log('User data fetched:', userData);

    if (!userData) {
      console.log('No user found for ID:', userId);
      return res.status(404).json({ error: 'No information found for the user' });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error retrieving user data', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Middleware to check if user is an admin
 * This function will be further implemented with actual authentication logic
 * Currently acts as a placeholder for future authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function isAdmin(req, res, next) {
  // For demonstration purposes, we'll add a placeholder
  // In a real implementation, this would check session/token data
  // and verify the user's role against the database

  // TODO: Replace with actual implementation that:
  // 1. Verifies user is authenticated (token/session)
  // 2. Checks if the user has admin privileges (role_id)

  console.log('Checking admin permissions');

  // For now, allow the request to proceed
  // This would be replaced with actual auth logic later
  next();
}

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created user data
 */
export async function createUser(req, res) {
  try {
    console.log('Create user request received');

    const userData = {
      role_id: parseInt(req.body.role_id),
      department_id: parseInt(req.body.department_id),
      user_name: req.body.user_name,
      password: req.body.password,
      workstation: req.body.workstation,
      email: req.body.email,
      phone_number: req.body.phone_number
    };

    console.log('Processing user creation for:', userData.user_name);

    // Call service to create user
    const result = await userService.createUser(userData);

    console.log('User created successfully:', result.user_id);
    return res.status(201).json({
      message: 'User created successfully',
      user_id: result.user_id
    });
  } catch (error) {
    console.error('Error creating user', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Export default object with all controller functions for named imports
export default {
  getUserData,
  isAdmin,
  createUser
};
