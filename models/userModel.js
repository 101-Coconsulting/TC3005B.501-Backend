import db from '../database/config/db.js';

/**
 * Get all user data by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - User data
 */
export async function getUserData(userId) {
  const connection = await db.getConnection();
  try {
    const rows = await connection.query(
      `SELECT 
        u.user_id, 
        u.user_name, 
        u.email, 
        u.phone_number,
        u.workstation,
        d.department_name,
        d.costs_center,
        u.creation_date, 
        r.role_name
      FROM User u
      JOIN Role r ON u.role_id = r.role_id
      JOIN Department d ON u.department_id = d.department_id
      WHERE u.user_id = ?`,
      [userId]
    );
    
    return rows[0];

  } finally {
    connection.release();
  }
}

export async function createUser(userData) {
  const connection = await db.getConnection();
  try {
    // Check if user already exists with the same email or username
    const existingUser = await connection.query(
      'SELECT user_id FROM User WHERE email = ? OR user_name = ?',
      [userData.email, userData.user_name]
    );

    if (existingUser.length > 0) {
      throw new Error('User with this email or username already exists');
    }

    // Insert the new user
    const result = await connection.query(
      `INSERT INTO User (
        role_id,
        department_id,
        user_name,
        password,
        workstation,
        email,
        phone_number,
        creation_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        userData.role_id,
        userData.department_id,
        userData.user_name,
        userData.password,
        userData.workstation,
        userData.email,
        userData.phone_number || null
      ]
    );

    return {
      user_id: result.insertId,
      message: 'User created successfully'
    };
  } finally {
    connection.release();
  }
}
