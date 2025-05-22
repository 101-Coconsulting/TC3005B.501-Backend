import dotenv from 'dotenv';  // For environment variable loading.
import mariadb from 'mariadb';  // For connection to `mariadb` DataBase.

import fs from "fs";  // For accesing the FileSystem an reading the `.sql` scripts.

dotenv.config();

const pool = mariadb.createPool({
    multipleStatements: true,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const environment = process.argv[2];

async function devdb() {
    let conn;
    const schema = fs.readFileSync("./database/Schema/Scheme.sql", 'utf8');
    const prepop = fs.readFileSync("./database/Schema/Prepopulate.sql", 'utf8');
    const triggers = fs.readFileSync("./database/Schema/Triggers.sql", 'utf8');
    const views = fs.readFileSync("./database/Schema/Views.sql", 'utf8');
    let dummy;
    if (environment === 'dev') {
        dummy = fs.readFileSync("./database/Schema/Dummy.sql", 'utf8');
    }

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

        if (environment === 'dev' && dummy) {
            console.log("Executing Dummy.sql...");
            await conn.query(dummy);
            console.log("Dummy.sql executed.");
        }
        
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

devdb();