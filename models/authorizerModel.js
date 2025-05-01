/*
Authorizer Model
*/
import pool from '../database/config/db.js';

const Authorizer = {
    async getTravelRequest(id) {
        let conn;
        const query = `SELECT 
                        request_id,
                        status,
                        notes,
                        requested_fee,
                        imposed_fee,
                        creation_date,
                        user_name,
                        user_email,
                        user_phone_number,
                        origin_countries,
                        origin_cities,
                        destination_countries,
                        destination_cities,
                        beginning_dates,
                        beginning_times,
                        ending_dates,
                        ending_times,
                        hotel_needed_list,
                        plane_needed_list
                        FROM RequestWithRouteDetails 
                        WHERE request_id = ?`;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error getting travel request: ', error);
            throw error;
        } finally {
            if (conn){
                conn.release();
            }
        }
    },

    async getTravelRequestsDept(dept, status, n) {
        let conn;
        const query = `SELECT 
                        request_id,
                        user_id,
                        destination_countries,
                        beginning_dates,
                        ending_dates,
                        status
                        FROM RequestWithRouteDetails 
                        WHERE department_id = ? AND request_status_id = ? LIMIT ?`;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [dept, status, n]);
            return rows;
        } catch (error) {
            console.error('Error getting travel requests: ', error);
            throw error;
        } finally {
            if (conn){
                conn.release();
            }
        }
    },

    async getAlerts(id, status_id, n) {
      let conn;
      const query =  `
        SELECT Alert.alert_id, User.user_name, Alert.request_id, Alert.alert_text, DATE(Alert.alert_date) AS alert_date, TIME(Alert.alert_date) AS alert_time
        FROM Alert
        INNER JOIN User ON Alert.user_id = User.user_id
        INNER JOIN Request ON Alert.request_id = Request.request_id
        INNER JOIN Request_status ON Request.request_status_id = Request_status.request_status_id
        WHERE User.department_id = ? AND Request_status.request_status_id = ?
        ${n == 0 ? ';' : 'LIMIT ?;'}`;
      try {
        conn = await pool.getConnection();
        const rows = await conn.query(query, [id, status_id, n]);
        return rows;
      } catch (error) {
        console.error("Error getting completed requests:", error);
        throw error;
      } finally {
        if (conn) {
          conn.release();
        }
      }
    },
};

export default Authorizer;