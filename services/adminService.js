import Admin from "../models/adminModel.js";
import * as userService from "../services/userService.js";


export async function createUser(userData) {
  try {
    // Use the userService to handle validation and creation
    return await userService.createUser(userData);
  } catch (error) {
  
    throw error;
  }
}


export async function getUserList() {
  try {
    return await Admin.getUserList();
  } catch (error) {
    throw new Error(`Error fetching user list: ${error.message}`);
  }
}


export default {
  createUser,
  getUserList
};
