/*
CPP Model
Miguel Soria 09/05/25
Queries to the DB related to CPP actions
*/
import pool from "../database/config/db.js";

const AccountsPayable = {
    // Update request status to 5 (Atención Agencia de Viajes)
    async attendTravelRequest(requestId, imposedFee, new_status) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                `UPDATE Request SET request_status_id = ?, imposed_fee = ? 
                WHERE request_id = ?`,
                [new_status, imposedFee, requestId],
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
                 `SELECT request_id, request_status_id, hotel_needed_list, plane_needed_list 
                 FROM RequestWithRouteDetails WHERE request_id = ?`,
                [requestId],
            );
            return rows[0];
        } catch (error) {
            console.error("Error checking if request exists:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },

    async getReceiptStatusesForRequest(requestId) {
        let conn;
        const query = `
            SELECT validation FROM Receipt
            WHERE request_id = ?
        `;

        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [requestId]);
            return rows.map(r => r.validation);
        } catch (error) {
            console.error('Error fetching receipt statuses:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

    async updateRequestStatus(requestId, statusId) {
        let conn;
        const query = `
            UPDATE Request
            SET request_status_id = ?
            WHERE request_id = ?
        `;

        try {
            conn = await pool.getConnection();
            await conn.query(query, [statusId, requestId]);
        } catch (error) {
            console.error('Error updating request status:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

};

export default AccountsPayable;
