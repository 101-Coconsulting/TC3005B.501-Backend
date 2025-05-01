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

  async getApplicantRequests(id) {
    let conn;
    const query = `
      SELECT
        r.request_id,
        rs.status AS request_status,
        c.country_name AS destination_country_name,
        ro.beginning_date,
        ro.beginning_time,
        ro.ending_date,
        ro.ending_time
      FROM Request r
      JOIN Route_Request rr ON r.request_id = rr.request_id
      JOIN Route ro ON rr.route_id = ro.route_id
      JOIN Country c ON ro.id_destination_country = c.country_id
      JOIN Request_status rs ON r.request_status_id = rs.request_status_id
      WHERE r.user_id = ?
      AND r.request_status_id NOT IN (8, 9, 10)
      GROUP BY r.request_id, rs.status, c.country_name;
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
