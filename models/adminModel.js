/* 
Admin Model
*/
import pool from '../database/config/db.js';

const Admin = {
  // Find applicant by ID
  async getUserList() {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM UserFullInfo');
      return rows;
      
    } catch (error) {
      console.error('Error finding applicant by ID:', error);
      throw error;
    } finally {
      if (conn){
        conn.release();
      } 
    }
  },

  /**
   * Deactivate a user (soft delete)
   * @param {number} userId - User ID to deactivate
   * @returns {Promise<boolean>} - True if successful
   */
  async deactivateUserById(userId) {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(
        `UPDATE User SET active = FALSE WHERE user_id = ?`,
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
};

export default Admin;