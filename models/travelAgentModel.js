/* 
Travel Agent Model
Miguel Soria 26/04/25
Queries to the DB related to travel agent actions
*/
import pool from "../database/config/db.js";

const TravelAgent = {
    // Update request status to 6 
    async attendTravelRequest(requestId) {
        let conn;
        const logQuery = `
            INSERT INTO Request_log (request_id, request_status_id, user_id)
            VALUES (?, (SELECT request_status_id FROM Request WHERE request_id = ?), (SELECT user_id FROM Request WHERE request_id = ?))
        `;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                "UPDATE `Request` SET request_status_id = 6 WHERE request_id = ?",
                [requestId],
            );
            if (result.affectedRows > 0) {
                await conn.query(logQuery, [requestId, requestId, requestId]);
            }

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
};

export default TravelAgent;
