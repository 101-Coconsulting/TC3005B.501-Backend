/* 
Applicant Model
*/
import pool from '../database/config/db.js';

const Authorizer = {

  async getAlerts(id, status, n){
    let conn;
    const query =  `
      SELECT Alert.alert_id, Alert.user_id, Alert.request_id, Alert.alert_text, DATE(Alert.alert_date) AS alert_date, TIME(Alert.alert_date) AS alert_time
      FROM Alert
      INNER JOIN User ON Alert.user_id = User.user_id
      INNER JOIN Request ON Alert.request_id = Request.request_id
      INNER JOIN Request_status ON Request.request_status_id = Request_status.request_status_id
      WHERE User.department_id = ? AND Request_status.status = ?
      ${n == 0 ? ';' : 'LIMIT ?;'}`;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(query, [id, status, n]);
      return rows;
    } catch (error) {
      console.error("Error getting completed requests:", error);
      trow error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
};

export default Authorizer;
