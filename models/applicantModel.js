/*
Applicant Model
*/
import pool from '../database/config/db.js';

const Applicant = {
  // Find applicant by ID
  async findById(id) {
    let conn;
    console.log(`Searching for user with id: ${id}`);
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM user WHERE user_id = ?', [id]);
      console.log(rows[0]);
      return rows[0];

    } catch (error) {
      console.error('Error finding applicant by ID:', error);
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  },

  async findCostCenterByUserId(user_id) {
    let conn;

    try {
      conn = await pool.getConnection();
      const rows = await conn.query(`
        SELECT d.*
        FROM User u
        JOIN Department d ON u.department_id = d.id
        WHERE u.id = ?
      `, [user_id]);
      console.log(rows[0]);
      return rows[0];

    } catch (error) {
      console.error('Error finding cost center by ID:', error);
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  },
};

export default Applicant;
