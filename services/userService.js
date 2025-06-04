import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

/**
 * Authenticate user and generate JWT
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} - Authenticated user data and token
 */
export async function authenticateUser(username, password, req) {
  try {
    const user = await userModel.getUserUsername(username);
    
    if (!user || user.length === 0) {
      throw new Error("Invalid username or password");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    if (!user.active) {
      throw new Error("User acccount is inactive")
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role_name, userAgent: req.headers['user-agent'], ip: req.ip },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return {
      token,
      role: user.role_name,
      username: user.user_name,
      user_id: user.user_id,
      department_id: user.department_id 
    };
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

// Export default object with all service functions
export default {
  getUserById
};  
