/* 
Authorizer Model
*/

import pool from '../database/config/db.js';

const Authorizer = {

    async declineTravelRequest(id) {
        let conn;
        const query = `
            UPDATE Request
            SET request_status_id = 10
            WHERE request_id = ?
        `;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [id]);
            return true;
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

export default Authorizer;