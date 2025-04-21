/* 
Applicant Model
*/
import pool from '../database/config/db.js';

const Applicant = {
  // Find applicant by ID
  async findById(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM applicant WHERE id = ?', [id]);
      console.log(`User found: ${(rows[0]).name}`);
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
