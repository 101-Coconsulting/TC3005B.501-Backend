import dotenv from 'dotenv';
import mariadb from 'mariadb';

dotenv.config({ path: '../../.env' });

const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_ROOT_USER,
  password: process.env.DB_ROOT_PASSWORD,
});

pool.getConnection()
  .then(async (conn) => {
    try {
      await conn.query(`CREATE DATABASE IF NOT EXISTS ${db_name};`);
      await conn.query(`USE ${db_name};`);
      await conn.query(
        `CREATE USER IF NOT EXISTS '${db_user}'@'%' IDENTIFIED BY ?`,
        [db_password]
      );
      await conn.query(
        `GRANT SELECT, INSERT, UPDATE ON ${db_name}.* TO '${db_user}'@'%'`
      );
      console.log('User created with privileges successfully.');
    } catch (err) {
      console.error('Error creating user or granting privileges:', err);
    } finally {
      conn.release();
      pool.end()
      .then(() => console.log("Pool has ended"))
      .catch(err => console.log(err));
    }
  })
  .catch((err) => {
    console.error('Error getting connection:', err);
  });
