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