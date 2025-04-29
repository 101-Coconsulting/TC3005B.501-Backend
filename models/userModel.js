import db from '../database/config/db.js';

/**
 * Get all user data by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - User data
 */
export async function getUserData(userId) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        u.id, 
        u.user_name, 
        u.email, 
        u.phone_number, 
        u.date_of_creation, 
        r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?`,
      [userId]
    );
    
    return rows.length ? rows[0] : null;
  } finally {
    connection.release();
  }
}