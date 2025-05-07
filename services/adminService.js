/*
Admin services
*/

import Admin from "../models/adminModel.js";
import * as userService from "../services/userService.js";

/**
 * Creates a new user through the admin service
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} - Created user information
 */
export async function createUser(userData) {
    try {
        // Use the user service to handle validation and processing
        const processedUserData = await userService.preprocessUserData(userData);
        
        // Pass to admin model for creation
        return await Admin.createUser(processedUserData);
    } catch (error) {
        throw error;
    }
}

/**
 * Reads and processes a CSV file for bulk user creation
 */
export async function readCSV(file) {
    // Implementation for CSV processing
}

export default {
    createUser,
    readCSV
};