/* 
Admin Model
*/
import db from '../database/config/db.js';
import pool from '../database/config/db.js';

const Admin = {
  // Find applicant by ID
  async getUserList() {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(`SELECT * FROM UserFullInfo 
        WHERE active = 1 ORDER BY department_id`);
      return rows;
      
    } catch (error) {
      console.error('Error finding applicant by ID:', error);
      throw error;
    } finally {
      if (conn){
        conn.release();
      } 
    }
  },
  async createMultipleUsers(users) {
      let conn;

      const values = users.map(user => [
          user.role_id,
          user.department_id,
          user.user_name,
          user.password,
          user.workstation,
          user.email,
          user.phone_number
      ]);

      const query = `INSERT INTO User (role_id, department_id, user_name, password, workstation, email, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)`;

      try {
          conn = await pool.getConnection();
          const result = await conn.batch(query, values);
          return result.affectedRows;
      } catch (error) {
          console.error('Error getting completed requests:', error);
          throw error;
      } finally {
          if (conn){
              conn.release();
          } 
      }
  },

  async findRoleID(role_name) {
      let conn;
      try {
          conn = await pool.getConnection();
          const name = await conn.query('SELECT role_id FROM Role WHERE role_name = ?', [role_name]);
          if (name && name.length > 0) {
              return name[0].role_id;
          }
          return null;
      } catch (error) {
            console.error('Error finding role ID for %s:', role_name, error);
          throw error;
      } finally {
          if (conn) conn.release();
      }
  },

  async findDepartmentID(department_name) {
      let conn;
      try {
          conn = await pool.getConnection();
          const name = await conn.query('SELECT department_id FROM Department WHERE department_name = ?', [department_name]);

          if (name && name.length > 0) {
              return name[0].department_id;
          }
          return null;
      } catch (error) {
            console.error('Error finding department ID for %s:', department_name, error);
          throw error;
      } finally {
          if (conn) conn.release();
      }
  },

  async findUserByEmail(email) {
      let conn;
      try {
          conn = await pool.getConnection();
          const rows = await conn.execute('SELECT user_id FROM User WHERE email = ?', [email]);

          if (rows && rows.length > 0) {
              return true;
          } else if (rows === undefined || rows === null) {
                return false;
          }

          return false;
      } catch (error) {
          console.error('Database Error in findUserByEmail:', error);
          throw error;
      } finally {
          if (conn) conn.release();
      }
  },

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

      await connection.query(
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
    } finally {
      connection.release();
    }
  },

  async getAllEmails() {
    let conn;

    const query = `
        SELECT email FROM User;
    `;

    try {
      conn = await pool.getConnection();
      
      const allEmails = conn.query(query);
      return allEmails;
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  async updateUser(user_id, fieldsToUpdate) {
    let conn;

    const setClauses = [];
    const values =[];

    for (const field in fieldsToUpdate) {
        setClauses.push(`${field} = ?`);
        values.push(fieldsToUpdate[field]);
      }

    values.push(user_id);

    const query = `
        UPDATE User
        SET ${setClauses.join(', ')}
        WHERE user_id = ?
      `;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(query, values);
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  /**
   * Deactivate a user (soft delete)
   * @param {number} userId - User ID to deactivate
   * @returns {Promise<boolean>} - True if successful
   */
  async deactivateUserById(userId) {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(
        `UPDATE User SET active = FALSE WHERE user_id = ?`,
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
};

export default Admin;
