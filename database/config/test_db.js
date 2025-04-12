import dotenv from 'dotenv';
import mariadb from 'mariadb';

dotenv.config({ path: '../../.env' });

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_ROOT_USER,
  password: process.env.DB_ROOT_PASSWORD,
});

async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Successfully connected to the database!');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    if (conn) {
      conn.release();
    }
    pool.end()
      .then(() => console.log("Pool has ended"))
      .catch(err => console.log(err));
  }
}

testConnection();
