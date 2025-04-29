/* 
Authorizer Model
*/

import pool from '../database/config/db.js';

const user = {

    async declineTravelRequest(id) {
        let conn;
        const query = `
            UPDATE Request
            SET status = Rechazado
            WHERE request_id = ?
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