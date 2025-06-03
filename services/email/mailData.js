import pool from "../../database/config/db.js";

async function getMailDetails(request_id){
    let conn;
    const query = `
    SELECT user_email,
        user_name,
        request_id,
        status
    FROM RequestWithRouteDetails
    WHERE request_id = ?
    `;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(query, [request_id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching mail data:', error);
        throw error;
    } finally {
        if (conn){
            conn.release();
        } 
    }
};

export default getMailDetails;