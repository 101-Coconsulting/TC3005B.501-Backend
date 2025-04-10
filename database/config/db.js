/*DB connection
To use this functionality, please refer to the example
under this same folder 'db_example.js'*/
const dotenv = require ('dotenv');
const mariadb = require ('mariadb');

dotenv.config({path: '../../.env'});

const pool = mariadb.createPool({
     host: process.env.DB_HOST,
     port: process.env.DB_PORT, 
     user:process.env.DB_USER, 
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME
});

module.exports = pool;