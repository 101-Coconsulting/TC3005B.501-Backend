import * as userModel from '../models/userModel.js';

export async function getUserById(userId) {
  try {
    return await userModel.getUserData(userId);
  } catch (error) {
    throw new Error(`Error fetching user with ID ${userId}: ${error.message}`);
  }
}


// Export default object with all service functions
export default {
  getUserById
};  
