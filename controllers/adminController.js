/*
Admin Controller
*/
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";

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

export const putUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.user_id);
    
        if (isNaN(userId)) {
          console.log('Invalid user ID format');
          return res.status(400).json({ error: 'Invalid user ID format' });
        }
    
        const userData = await User.getUserData(userId);
    
        if (!userData) {
          console.log('No user found for ID:', userId);
          return res.status(404).json({ error: 'No information found for the user' });
        }
        
        const newUserData = req.body;
        const isEmail = await Admin.findUserByEmail(req.body.email);
        if (isEmail) {
            return res.status(400).json({error: "Email already in use"});
        }
        const updatedFields = [];
        const fieldsToUpdateInDb = {};
        const keysToCompare = [
            'role_name',
            'department_name',
            'user_name',
            'workstation',
            //'password',
            'email',
            'phone_number',
        ];

        for (const key of keysToCompare) {
            if (newUserData[key] !== undefined && newUserData[key] !== userData[key]) {
                updatedFields.push(key);
                if (key === 'role_name') {
                    const roleID = await Admin.findRoleID(newUserData[key]);
                    if (roleID !== null) {
                        fieldsToUpdateInDb.role_id = roleID;
                    } else {
                         return res.status(400).json({ error: `Invalid role name provided: ${newUserData[key]}` });
                    }
                } else if (key === 'department_name') {
                    const deptId = await Admin.findDepartmentID(newUserData[key]);
                     if (deptId !== null) {
                         fieldsToUpdateInDb.department_id = deptId;
                     } else {
                          return res.status(400).json({ error: `Invalid department name provided: ${newUserData[key]}` });
                     }
                } else {
                    fieldsToUpdateInDb[key] = newUserData[key];
                }
            }
        }

        if (Object.keys(fieldsToUpdateInDb).length > 0) {
            await Admin.updateUser(userId, fieldsToUpdateInDb);

            return res.status(200).json({ message: "User updated successfully", updated_fields: updatedFields });
        } else {
            return res.status(200).json({ message: "No changes detected, user data is up to date" });
        }
    } catch (error) {
        console.error('An error occurred in putUser:', error);
        return res.status(500).json({description: "Internal server error"});
    }
}

export default {
    getUserList,
};