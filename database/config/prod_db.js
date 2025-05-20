import dotenv from 'dotenv';
import mariadb from 'mariadb';

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pool = mariadb.createPool({
  multipleStatements: true,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

import fs from "fs";


async function proddb() {
    let conn;
    const schema = fs.readFileSync("./database/Schema/Scheme.sql", 'utf8');
        const prepop = fs.readFileSync("./database/Schema/Prepopulate.sql", 'utf8');
        const triggers = fs.readFileSync("./database/Schema/Triggers.sql", 'utf8');
        const views = fs.readFileSync("./database/Schema/Views.sql", 'utf8');
    try {
        conn = await pool.getConnection();
        
        console.log("Executing Scheme.sql...");
        await conn.query(schema);
        console.log("Scheme.sql executed.");

        console.log("Executing Prepopulate.sql...");
        await conn.query(prepop);
        console.log("Prepopulate.sql executed.");

        console.log("Executing Triggers.sql...");
        await conn.query(triggers);
        console.log("Triggers.sql executed.");

        console.log("Executing Views.sql...");
        await conn.query(views);
        console.log("Views.sql executed.");
        
    } catch (error) {
        console.error(error);
    } finally {
        if (conn){
        conn.release();
        }
        pool.end()
          .then(() => console.log("Database connection pool closed."))
          .catch(err => console.error("Error closing database connection pool:", err));
    }
}

proddb();