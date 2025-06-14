import dotenv from 'dotenv';  // For environment variable loading.
import mariadb from 'mariadb';  // For connection to `mariadb` DataBase.

import fs from "fs";  // For accesing the FileSystem an reading the `.sql` scripts.

import { parseCSV } from "../../services/adminService.js"

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

    try {
        conn = await pool.getConnection();

        console.log("Executing Scheme.sql...");
        await conn.query({
            sql: fs.readFileSync("./database/Schema/Scheme.sql", "utf8")
        });
        console.log("Scheme.sql executed.");

        console.log("Executing Prepopulate.sql...");
        await conn.importFile({file: "./database/Schema/Prepopulate.sql"});
        console.log("Prepopulate.sql executed.");

        console.log("Executing Triggers.sql...");
        await conn.query({
            sql: fs.readFileSync("./database/Schema/Triggers.sql", "utf8")
        });
        console.log("Triggers.sql executed.");

        console.log("Executing Views.sql...");
        await conn.importFile({file: "./database/Schema/Views.sql"});
        console.log("Views.sql executed.");

        if (environment === 'dev') {
            console.log("Executing Dummy.sql...");
            const dummySqlContent = fs.readFileSync("./database/Schema/Dummy.sql", "utf8");
            const departmentSql = dummySqlContent.match(/(INSERT INTO Department[^;]*;)/i);
            
            const remainingDummySql = dummySqlContent.replace(departmentSql[0], '').trim();
            
            await conn.query(departmentSql[0]);
            const res = await parseCSV("./database/config/dummy_users.csv", true);
            console.log(res);
            await conn.query(remainingDummySql);
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
