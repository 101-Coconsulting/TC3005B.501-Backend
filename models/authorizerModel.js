/* 
Authorizer Model
*/

import pool from '../database/config/db.js';

const user = {

    async getStatusId(id) {
      let conn;
      const query = `
        SELECT request_status_id,
        FROM Request
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

    async authorizeTravelRequest(id, status_id) {
        let conn;
        const query = `
            UPDATE Request
            SET request_status_id = ?
            WHERE request_id = ?
        `;
        try {
          conn = await pool.getConnection();
          const rows = await conn.query(query, [status_id],[id]);
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