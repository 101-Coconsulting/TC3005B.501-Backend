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
};
