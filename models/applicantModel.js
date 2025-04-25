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
      if (conn){
        conn.release();
      } 
    }
  },
  async getCompletedRequests(id) {
    let conn;
    const query = `
      SELECT request_id,
        destination_country,
        request_date,
        status
      FROM requests
      WHERE applicant_id = ?
        AND status = 'closed'
    `;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(query, [id]);
      return rows;
    } catch (error) {
      console.error('Error getting completed requests:', error);
      throw error;
    } finally {
      if (conn){
        conn.release();
      } 
    }
  },
};

export default Applicant;
