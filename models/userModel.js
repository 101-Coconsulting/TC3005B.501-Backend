import pool from '../database/config/db.js';

const User = {
  // Get all user data by ID
  async getUserData(userId) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        `SELECT 
          u.user_id, 
          u.user_name, 
          u.email, 
          u.phone_number,
          u.workstation,
          d.department_name,
          d.costs_center,
          u.creation_date, 
          r.role_name
        FROM User u
        JOIN Role r ON u.role_id = r.role_id
        JOIN Department d ON u.department_id = d.department_id
        WHERE u.user_id = ?`,
        [userId]
      );

      return rows[0];
    } finally {
      if (conn) conn.release();
    }
  },

  async getTravelRequestById(request_id) {
    let conn;
    const query = `
      SELECT 
        r.request_id,
        rs.status AS request_status,
        r.notes,
        r.requested_fee,
        r.imposed_fee,
        r.request_days,
        r.creation_date,
        u.user_name,
        u.email AS user_email,
        u.phone_number AS user_phone_number,

        ro.router_index,
        co1.country_name AS origin_country,
        ci1.city_name AS origin_city,
        co2.country_name AS destination_country,
        ci2.city_name AS destination_city,

        ro.beginning_date,
        ro.beginning_time,
        ro.ending_date,
        ro.ending_time,
        ro.hotel_needed,
        ro.plane_needed

      FROM Request r
      JOIN User u ON r.user_id = u.user_id
      JOIN Request_status rs ON r.request_status_id = rs.request_status_id
      LEFT JOIN Route_Request rr ON r.request_id = rr.request_id
      LEFT JOIN Route ro ON rr.route_id = ro.route_id
      LEFT JOIN Country co1 ON ro.id_origin_country = co1.country_id
      LEFT JOIN City ci1 ON ro.id_origin_city = ci1.city_id
      LEFT JOIN Country co2 ON ro.id_destination_country = co2.country_id
      LEFT JOIN City ci2 ON ro.id_destination_city = ci2.city_id
      WHERE r.request_id = ?
      ORDER BY ro.router_index ASC
    `;

    try {
      conn = await pool.getConnection();
      const rows = await conn.query(query, [request_id]);
      return rows;
    } catch (error) {
      console.error('Error in getTravelRequestById:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  async getTravelRequestsByDeptStatus(dept, statusId, n) {
  const conn = await pool.getConnection();
  try {
    const baseQuery = `
      SELECT
        r.request_id,
        u.user_id,
        c.country_name AS destination_country,
        ro.beginning_date,
        ro.ending_date,
        rs.status AS request_status
      FROM Request r
      JOIN User u ON r.user_id = u.user_id
      JOIN Request_status rs ON r.request_status_id = rs.request_status_id
      JOIN Route_Request rr ON r.request_id = rr.request_id
      JOIN Route ro ON rr.route_id = ro.route_id
      JOIN Country c ON ro.id_destination_country = c.country_id
      WHERE u.department_id = ?
        AND r.request_status_id = ?
      GROUP BY r.request_id
      ORDER BY r.creation_date DESC
      ${n ? 'LIMIT ?' : ''}
    `;

    const params = n ? [dept, statusId, Number(n)] : [dept, statusId];
    const rows = await conn.query(baseQuery, params);
    return rows;
  } finally {
    conn.release();
  }
},
/*
 * Get user by username
 * @param {string} username - Username
 * @returns {Promise<Object>} - User data
 */
  async getUserUsername(username) {
    const connection = await pool.getConnection();
    try {
      const rows = await connection.query(
        `SELECT 
          u.user_name, 
          u.password, 
          r.role_name 
        FROM User u
        JOIN Role r ON u.role_id = r.role_id
        WHERE u.user_name = ?`,
        [username]
      );

      return rows[0];

    } finally {
      connection.release();
    }
  },

};

export default User;
