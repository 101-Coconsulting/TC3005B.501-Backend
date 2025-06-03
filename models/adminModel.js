/* 
Admin Model
*/
import pool from '../database/config/db.js';

const Admin = {

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
            console.error(`Error finding department ID for '${department_name}':`, error);
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

  // Find applicant by ID
  async getUserList() {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM UserFullInfo WHERE active = 1');
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
  
};

export default Admin;