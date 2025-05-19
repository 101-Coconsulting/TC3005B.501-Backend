/*
Admin Controller
*/
import Admin from "../models/adminModel.js";
import userModel from "../models/userModel.js";

export const getUserList = async (req, res) => {
    try {
        const users = await Admin.getUserList();
        if (!users) {
            return res.status(404).json({error: "No users found"});
        }
        const formattedUsers = users.map( user => ({
            user_id: user.user_id,
            user_name: user.user_name,
            email: user.email,
            role_name: user.role_name,
            department_name: user.department_name
        }));
        res.status(200).json(formattedUsers);
    } catch(err) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

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
    deactivateUser
};