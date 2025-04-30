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
        u.date_of_creation, 
        r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = ?`,
      [userId]
    );
    console.log('Query result:', rows); // Debugging log
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Database query error:', error); // Log any query errors
    throw error;
  } finally {
    connection.release();
  }
}