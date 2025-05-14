/*
Admin Controller
*/
import * as adminService from "../services/adminService.js";
import Admin from "../models/adminModel.js";

/**
 * Get list of all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user list
 */
export const getUserList = async (req, res) => {
    try {
        const users = await adminService.getUserList();
        if (!users) {
            return res.status(404).json({error: "No users found"});
        }
        const formattedUsers = users.map(user => ({
            user_id: user.user_id,
            user_name: user.user_name,
            email: user.email,
            role_name: user.role_name,
            department_name: user.department_name
        }));
        res.status(200).json(formattedUsers);
    } catch(error) {
        console.error('Error getting user list:', error.message);
        return res.status(500).json({ error: 'Internal server error'});
    }
}

/**
 * Create a new user (admin functionality)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created user data
 */
export const createUser = async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await adminService.createUser(userData);
      return res.status(201).json({ message: 'User created succesfully'});
    } catch (error) {
      console.error('Error creating user:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
}

export default {
    getUserList,
    createUser
};
