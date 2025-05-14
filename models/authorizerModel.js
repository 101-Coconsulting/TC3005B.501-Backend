/*
Authorizer Model
*/

import pool from '../database/config/db.js';

const Authorizer = {

  async getUserRole(user_id) {
    let conn;
    const query = `
        SELECT role_id FROM User WHERE user_id = ?
      `;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(query, [user_id]);
      if (rows.length > 0) {
        return rows[0].role_id;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user role:', error);
      throw error;
    } finally {
      if (conn) conn.release();
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
      const rows = await conn.query(query, [status_id, id]);
      return rows;
    } catch (error) {
      console.error('Error getting completed requests:', error);
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  },
  async declineTravelRequest(request_id) {
    let conn;
    const query = `
            UPDATE Request
            SET request_status_id = 10
            WHERE request_id = ?
        `;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(query, [request_id]);
      return true;
    } catch (error) {
      console.error('Error getting completed requests:', error);
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  },
};

export default Authorizer;