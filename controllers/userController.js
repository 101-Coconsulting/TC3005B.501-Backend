import * as userService from '../services/userService.js';


function handleError(res, error, defaultMessage) {
  console.error(defaultMessage, error);

  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  return res.status(500).json({ error: defaultMessage });
}


export async function getUserData(req, res) {
  try {
    console.log('Request received for user ID:', req.params.user_id);
    const userId = parseInt(req.params.user_id);

    if (isNaN(userId)) {
      console.log('Invalid user ID format');
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const userData = await userService.getUserById(userId);
    console.log('User data fetched:', userData);

    if (!userData) {
      console.log('No user found for ID:', userId);
      return res.status(404).json({ error: 'No information found for the user' });
    }

    return res.status(200).json(userData);
  } catch (error) {
    return handleError(res, error, 'Internal server error retrieving user data');
  }
}


export function isAdmin(req, res, next) {

  console.log('Checking admin permissions');
  
  next();
}


export async function createUser(req, res) {
  try {
    console.log('Create user request received');

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

    // Call service to create user
    const result = await userService.createUser(userData);

    console.log('User created successfully:', result.user_id);
    return res.status(201).json({
      message: 'User created successfully',
      user_id: result.user_id
    });
  } catch (error) {
    return handleError(res, error, 'Internal server error during user creation');
  }
}

// Export default object with all controller functions for named imports
export default {
  getUserData,
  isAdmin,
  createUser
};