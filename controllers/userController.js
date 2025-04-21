import * as userModel from '../models/userModel.js';

/**
 * Get user data by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data
 */
export async function getUserData(req, res) {
  try {
    const userId = parseInt(req.params.user_id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Query the database for user data
    const userData = await db.getUserById(userId);

    if (!userData) {
      return res.status(404).json({ error: 'No information found for the user' });
    }

    // Format the response
    const formattedResponse = {
      id: userData.user_id,
      user_name: userData.user_name,
      email: userData.user_email,
      phone_number: userData.user_phone_number,
      date_of_creation: userData.creation_date,
      role_name: userData.role_name
    };

    return res.status(200).json(formattedResponse);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserData
};
