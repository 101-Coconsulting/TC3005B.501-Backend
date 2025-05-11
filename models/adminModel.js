/* 
Admin Model
*/
import db from '../database/config/db.js';

const Admin = {
  async createUser(userData) {
    const connection = await db.getConnection();
    try{
      const existingUser = await connection.query(
        `SELECT
        user_id
        FROM User
        WHERE email = ? OR user_name = ?`,
        [userData.email, userData.user_name]
      );

      if (existingUser.length > 0) {
          throw new Error('User with this email or username already exists');
      }

      const result = await connection.query(
        `INSERT INTO User (
          role_id,
          department_id,
          user_name,
          password,
          workstation,
          email,
          phone_number,
          creation_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          userData.role_id,
          userData.department_id,
          userData.user_name,
          userData.password,
          userData.workstation,
          userData.email,
          userData.phone_number
        ]
      );

      return {
        user_id: result.insertId,
        message: 'User created succesfully'
      };
    } finally {
      connection.release();
    }
  },

  // Find applicant by ID
  async getUserList() {
    let conn;
    try {
      conn = await db.getConnection();
      const rows = await conn.query('SELECT * FROM UserFullInfo');
      return rows;

    } catch (error) {
      console.error('Error finding applicant by ID:', error);
      throw error;
    } finally {
      if (conn){
        conn.release();
      }
    }
};

export default Admin;
