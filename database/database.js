// database/db.js
const { Pool } = require('pg'); // Using PostgreSQL

// Use environment variables for database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getUserById = async (userId) => {
  try {
    const query = `
      SELECT 
        u.user_id,
        u.user_name,
        u.user_email,
        u.user_phone_number,
        u.creation_date,
        u.workstation,
        u.active,
        r.role_name, -- Assuming role table has a role_name column
        d.department_name -- Assuming department table has a department_name column
      FROM 
        "User" u
      LEFT JOIN 
        "Role" r ON u.role_id = r.role_id
      LEFT JOIN 
        "Department" d ON u.department_id = d.department_id
      WHERE 
        u.user_id = $1
        AND u.active = true
    `;
    
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error when fetching user:', error);
    throw error;
  }
};

module.exports = {
  getUserById,
  pool
};