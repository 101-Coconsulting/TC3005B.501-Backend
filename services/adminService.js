/*
Admin services
*/

import Admin from "../models/adminModel.js";
import * as userService from "../services/userService.js";


export async function createUser(userData) {
    try {
        
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