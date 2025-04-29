/*
Authorizer Model
*/
import pool from '../database/config/db.js';

const Authorizer = {
    async getTravelRequest(id) {
        console.log(`Model searching for travel request: ${id}`);
        let conn;
        const query = `SELECT 
                        request_id,
                        user_id,
                        request_status_id,
                        notes,
                        requested_fee,
                        imposed_fee,
                        destination_countries,
                        destination_cities,
                        creation_date,
                        last_mod_date,
                        active 
                        FROM RequestWithRouteDetails 
                        WHERE request_id = ?`;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [id]);
            console.log(rows[0]);
            return rows[0];
        } catch (error) {
            console.error('Error getting travel request: ', error);
            throw error;
        } finally {
            if (conn){
                conn.release();
            }
        }
    },
    async getTravelRequestsDept(dept, status, n) {
        let conn;
        const query = `SELECT 
                        request_id,
                        user_id,
                        request_status_id,
                        notes,
                        requested_fee,
                        imposed_fee,
                        destination_countries,
                        destination_cities,
                        creation_date,
                        last_mod_date,
                        active 
                        FROM RequestWithRouteDetails 
                        WHERE dept = ? AND status = ? LIMIT ?`;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [dept], [status], [n]);
            console.log(rows);
            return rows;
        } catch (error) {
            console.error('Error getting travel requests: ', error);
            throw error;
        } finally {
            if (conn){
                conn.release();
            }
        }
    },
};

export default Authorizer;