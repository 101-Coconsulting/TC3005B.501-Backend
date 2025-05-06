/* 
This is an example function on how to connect
to the DB and extracting information from it. 

To run the example from the console use the command:
    node db_example.js
*/
import pool from './db.js';

async function getApplicants() {
  let conn;
  try {
    //Connect to the DB
    conn = await pool.getConnection();
    //Replace with the actual query you want to test
    const rows = await conn.query("SELECT * FROM applicant;");
    console.log(rows);

  } catch (err) {
    console.error("Error in query:", err);
  } finally {
    if (conn) conn.end();
  }
}

//Close the connection
getApplicants().then(() => {
    pool.end();
});