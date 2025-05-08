import Admin from "../models/adminModel.js";
import * as userService from "../services/userService.js";

/**
 * Create a new user (admin functionality)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user data
 */
export async function createUser(userData) {
  try {
    // Use the userService to handle validation and creation
    return await userService.createUser(userData);
  } catch (error) {
    // Just rethrow the error, it's already properly formatted by userService
    throw error;
  }
}

/**
 * Get list of all users (admin functionality)
 * @returns {Promise<Array>} List of users
 */
export async function getUserList() {
  try {
    return await Admin.getUserList();
  } catch (error) {
    throw new Error(`Error fetching user list: ${error.message}`);
  }
}

// Export default object with all service functions
export default {
  createUser,
  getUserList
};
