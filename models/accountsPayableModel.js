/* 
CPP Model
Miguel Soria 09/05/25
Queries to the DB related to CPP actions
*/
import pool from "../database/config/db.js";

const AccountsPayable= {
    // Update request status to 5 (Atención Agencia de Viajes)
    async attendTravelRequest(requestId) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                "UPDATE `Request` SET request_status_id = 5 WHERE request_id = ?",
                [requestId],
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating travel request status:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },

    // Check if request exists in the DB, will be used in the model before the update
    async requestExists(requestId) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                "SELECT request_id FROM `Request` WHERE request_id = ?",
                [requestId],
            );

            return rows.length > 0;
        } catch (error) {
            console.error("Error checking if request exists:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },
    async authorizeExpenseValidation(id, status_id) {
        let conn;
        const query = `
            UPDATE Request
            SET request_status_id = ?
            WHERE request_id = ?
        `;
        try {
          conn = await pool.getConnection();
          const rows = await conn.query(query, [status_id, id]);
          return rows;
        } catch (error) {
          console.error('Error Validating request:', error);
          throw error;
        } finally {
          if (conn){
            conn.release();
          } 
        }
      },
};

export default AccountsPayable;
