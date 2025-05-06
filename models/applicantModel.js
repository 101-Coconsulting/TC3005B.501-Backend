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
        destination_countries,
        destination_cities,
        beginning_dates,
        ending_dates,
        creation_date,
        status
      FROM RequestWithRouteDetails
      WHERE user_id = ?
        AND status = 'Finalizado'
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

  /**
   * Inserts multiple receipts in a single query. Returns the number of rows inserted.
   * @param {Array<{receipt_type_id: number, request_id: number}>} receipts
   * @returns {number} How many rows were inserted
   */
  async createExpenseBatch(receipts) {
    const conn = await pool.getConnection();
    try {
      const placeholders = receipts.map(() => '(?, ?)').join(', ');
      const params = receipts.flatMap(r => [r.receipt_type_id, r.request_id]);

      const result = await conn.query(
        `INSERT INTO Receipt (receipt_type_id, request_id)
         VALUES ${placeholders}`,
        params
      );

      // result.affectedRows is the number of rows actually inserted
      return result.affectedRows;
    } finally {
      conn.release();
    }
  },
  
};

export default Applicant;