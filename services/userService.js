import * as userModel from '../models/userModel.js';
import crypto from 'crypto';


export async function getUserById(userId) {
  try {
    return await userModel.getUserData(userId);
  } catch (error) {
    throw new Error(`Error fetching user with ID ${userId}: ${error.message}`);
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function createUser(userData) {
  try {
    // Validate required fields
    const requiredFields = ['role_id', 'department_id', 'user_name', 'password', 'workstation', 'email'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (!Number.isInteger(userData.role_id)) {
      throw new Error('Role ID must be an integer');
    }
    
    if (!Number.isInteger(userData.department_id)) {
      throw new Error('Department ID must be an integer');
    }
    
    if (!isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    // Hash password before storing
    const hashedPassword = hashPassword(userData.password);
    
    const processedUserData = {
      ...userData,
      password: hashedPassword
    };
    

    return await userModel.createUser(processedUserData);
    
  } catch (error) {
    // Handle specific error types
    if (error.message.includes('already exists')) {
      throw {
        status: 409,
        message: error.message
      };
    } else if (error.message.includes('Missing required fields') || 
               error.message.includes('must be an integer') ||
               error.message.includes('Invalid email')) {
      throw {
        status: 400,
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