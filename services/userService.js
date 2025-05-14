import * as userModel from '../models/userModel.js';

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User data
 */
export async function getUserById(userId) {
  try {
    return await userModel.getUserData(userId);
  } catch (error) {
    throw new Error(`Error fetching user with ID ${userId}: ${error.message}`);
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUsername(username) {
  // Username should be alphanumeric and between 3-50 characters
  return typeof username === 'string' &&
         username.length >= 3 &&
         username.length <= 50 &&
         /^[a-zA-Z0-9._-]+$/.test(username);
}

function isValidPassword(password) {
  // Password should be at least 8 characters
  return typeof password === 'string' && password.length >= 8;
}

function isValidWorkstation(workstation) {
  // Workstation should be a string between 2-100 characters
  return typeof workstation === 'string' &&
         workstation.length >= 2 &&
         workstation.length <= 100;
}

function isValidPhoneNumber(phoneNumber) {
  // Optional phone number, but if provided should match pattern
  if (!phoneNumber) return true;
  return /^[0-9+\-\s()]{7,20}$/.test(phoneNumber);
}

export async function preprocessUserData(userData) {
  // Validate required fields
  const requiredFields = ['role_id', 'department_id', 'user_name', 'password', 'workstation', 'email'];
  const missingFields = requiredFields.filter(field => !userData[field]);

  if (missingFields.length > 0) {
    throw {
      status: 400,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }

  // Validate field types and formats
  if (!Number.isInteger(userData.role_id)) {
    throw {
      status: 400,
      message: 'Role ID must be an integer'
    };
  }

  if (!Number.isInteger(userData.department_id)) {
    throw {
      status: 400,
      message: 'Department ID must be an integer'
    };
  }

  if (!isValidUsername(userData.user_name)) {
    throw {
      status: 400,
      message: 'Username must be alphanumeric and between 3-50 characters'
    };
  }

  if (!isValidPassword(userData.password)) {
    throw {
      status: 400,
      message: 'Password must be at least 8 characters long'
    };
  }

  if (!isValidWorkstation(userData.workstation)) {
    throw {
      status: 400,
      message: 'Workstation must be between 2-100 characters'
    };
  }

  if (!isValidEmail(userData.email)) {
    throw {
      status: 400,
      message: 'Invalid email format'
    };
  }

  if (!isValidPhoneNumber(userData.phone_number)) {
    throw {
      status: 400,
      message: 'Invalid phone number format'
    };
  }

  // Not hashing password as per requirements
  return userData;
}

export async function createUser(userData) {
  try {
    const processedUserData = await preprocessUserData(userData);

    // call the model to create the user
    return await userModel.createUser(processedUserData);

  } catch (error) {
    // Handle specific error types
    if (error.status) {
      // If error already has status, just rethrow it
      throw error;
    } else if (error.message && error.message.includes('already exists')) {
      throw {
        status: 409,
        message: error.message
      };
    } else {
      throw {
        status: 500,
        message: `Error creating user: ${error.message}`
      };
    }
  }
}

// Export default object with all service functions
export default {
  getUserById,
  createUser,
  preprocessUserData
};