/*
Admin Controller
*/

import parseCSV from "../services/adminService.js";
import * as adminService from "../services/adminService.js";
import Admin from "../models/adminModel.js";
import userModel from "../models/userModel.js";


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
            department_name: user.department_name,
            phone_number: user.phone_number,
        }));
        res.status(200).json(formattedUsers);
    } catch(error) {
        console.error('Error getting user list:', error.message);
        return res.status(500).json({ error: 'Internal server error'});
    }
}

export const createMultipleUsers = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const filePath = req.file.path;

    try {
        const result = await adminService.parseCSV(filePath, false);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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
      await adminService.createUser(userData);
      return res.status(201).json({ message: 'User created succesfully'});
    } catch (error) {
      console.error('Error creating user:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.user_id;

        const result = await adminService.updateUserData(userId, req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error('An error occurred updating the user:', error);
        return res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
    }
};

export const deactivateUser = async (req, res) => {
    try {
        /* This doesn't work currently because there's no login yet
        
        if (!req.user || req.user.role_name !== 'Admin') {
            return res.status(401).json({
                error: "Admin privileges required"
            });
        }
        */

        const user_id = parseInt(req.params.user_id);
        
        const user = await userModel.getUserData(user_id);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        
        const result = await Admin.deactivateUserById(user_id);
        
        return res.status(200).json({
            message: "User successfully deactivated",
            user_id: user_id,
            active: false
        });
    } catch (err) {
        console.error("Error in deactivateUser:", err);
        return res.status(500).json({
            error: "Unexpected error while deactivating user"
        });
    }
}

export default {
    getUserList,
    deactivateUser,
    createMultipleUsers,
    createUser,
    updateUser
};
