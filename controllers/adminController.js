/*
Admin Controller
*/
import * as adminService from "../services/adminService.js";


function handleError(res, error, defaultMessage) {
  console.error(defaultMessage, error);

  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  return res.status(500).json({ error: defaultMessage });
}


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
    } catch(err) {
        return handleError(res, err, "Internal server error retrieving user list");
    }
}


const createUser = async (req, res) => {
    try {
        console.log('Create user request received in admin controller');

        const userData = {
            role_id: parseInt(req.body.role_id),
            department_id: parseInt(req.body.department_id),
            user_name: req.body.user_name,
            password: req.body.password,
            workstation: req.body.workstation,
            email: req.body.email,
            phone_number: req.body.phone_number
        };

        console.log('Processing user creation for:', userData.user_name);

        // Use adminService which uses userService for validation and creation
        const result = await adminService.createUser(userData);

        console.log('User created successfully:', result.user_id);
        return res.status(201).json({
            message: 'User created successfully',
            user_id: result.user_id
        });
    } catch (error) {
        return handleError(res, error, 'Internal server error during user creation');
    }
}

export default {
    getUserList,
    createUser
};