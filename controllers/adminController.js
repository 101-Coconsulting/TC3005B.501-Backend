/*
Admin Controller
*/
import * as adminService from "../services/adminService.js";

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


const createUser = async (req, res) => {

}

export default {
    getUserList,
    createUser
};
