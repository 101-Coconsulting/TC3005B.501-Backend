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

  // Edit travel request
  async editTravelRequest(request_id, travelChanges) {
    let conn;
    try {

      conn = await pool.getConnection();
      await conn.beginTransaction();

      // Update travel request



      // Commit transaction
      await conn.commit();
      return { message: 'Travel request updated successfully' };

    } catch (error) {
      if (conn) await conn.rollback();
      console.error('Error editing travel request:', error);
      throw new Error('Error editing travel request');
    }
    finally {
      if (conn) conn.release();
    }
  }

};

export default Applicant;
