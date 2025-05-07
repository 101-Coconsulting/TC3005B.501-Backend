/*
Admin Controller
*/
import Admin from "../models/adminModel.js";
const createUser = async(req, res) => {
    try {
        const userData = req.body;
        const result = await Admin.createUser(userData);
        return res.status(201).json({ message: 'User created successfully', user: result });
      } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const createMultipleUsers = async(req, res) => {

}

export default {
    createUser,
    createMultipleUsers
}