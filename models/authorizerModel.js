/*
Authorizer Model
*/
import pool from '../database/config/db.js';

const Authorizer = {
    async getTravelRequest(id) {
        let conn;
        const query = `SELECT 
                        request_id,
                        status,
                        notes,
                        requested_fee,
                        imposed_fee,
                        creation_date,
                        user_name,
                        user_email,
                        user_phone_number,
                        origin_countries,
                        origin_cities,
                        destination_countries,
                        destination_cities,
                        beginning_dates,
                        beginning_times,
                        ending_dates,
                        ending_times,
                        hotel_needed_list,
                        plane_needed_list
                        FROM RequestWithRouteDetails 
                        WHERE request_id = ?`;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [id]);
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
};

export default Authorizer;