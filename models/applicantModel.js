/* 
Applicant Model
*/
import pool from "../database/config/db.js";

const Applicant = {
    // Find applicant by ID
    async findById(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                "SELECT * FROM user WHERE user_id = ?",
                [id],
            );
            console.log(rows[0]);
            return rows[0];
        } catch (error) {
            console.error("Error finding applicant by ID:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },

    async getApplicantRequests(id) {
        let conn;
        const query = `
      SELECT
        r.request_id,
        rs.status AS status,
        c.country_name AS destination_country,
        ro.beginning_date,
        ro.ending_date
      FROM Request r
      JOIN Route_Request rr ON r.request_id = rr.request_id
      JOIN Route ro ON rr.route_id = ro.route_id
      JOIN Country c ON ro.id_destination_country = c.country_id
      JOIN Request_status rs ON r.request_status_id = rs.request_status_id
      WHERE r.user_id = ?
        AND r.request_status_id NOT IN (8, 9, 10)
      GROUP BY r.request_id
    `;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [id]);
            return rows;
        } catch (error) {
            console.error("Error in getApplicantRequests:", error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

    async getApplicantRequest(id) {
        let conn;
        const query = `
      SELECT 
        r.request_id,
        rs.status AS request_status,
        r.notes,
        r.requested_fee,
        r.imposed_fee,
        r.creation_date,
        r.last_mod_date,
        u.user_name,
        u.email AS user_email,
        u.phone_number AS user_phone_number,

        co1.country_name AS origin_country,
        ci1.city_name AS origin_city,
        co2.country_name AS destination_country,
        ci2.city_name AS destination_city,

        ro.router_index,
        ro.beginning_date,
        ro.beginning_time,
        ro.ending_date,
        ro.ending_time,
        ro.hotel_needed,
        ro.plane_needed

      FROM Request r
      JOIN User u ON r.user_id = u.user_id
      JOIN Request_status rs ON r.request_status_id = rs.request_status_id
      LEFT JOIN Route_Request rr ON r.request_id = rr.request_id
      LEFT JOIN Route ro ON rr.route_id = ro.route_id
      LEFT JOIN Country co1 ON ro.id_origin_country = co1.country_id
      LEFT JOIN City ci1 ON ro.id_origin_city = ci1.city_id
      LEFT JOIN Country co2 ON ro.id_destination_country = co2.country_id
      LEFT JOIN City ci2 ON ro.id_destination_city = ci2.city_id

      WHERE r.request_id = ?
      ORDER BY ro.router_index ASC
    `;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [id]);
            return rows;
        } catch (error) {
            console.error("Error in getApplicantRequest:", error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

    /**
     * Inserts multiple receipts in a single query. Returns the number of rows inserted.
     * @param {Array<{receipt_type_id: number, request_id: number}>} receipts
     * @returns {number} How many rows were inserted
     */
    async createExpenseBatch(receipts) {
        const conn = await pool.getConnection();
        try {
            const placeholders = receipts.map(() => "(?, ?)").join(", ");
            const params = receipts.flatMap((r) => [
                r.receipt_type_id,
                r.request_id,
            ]);

            const result = await conn.query(
                `INSERT INTO Receipt (receipt_type_id, request_id)
         VALUES ${placeholders}`,
                params,
            );

            // result.affectedRows is the number of rows actually inserted
            return result.affectedRows;
        } finally {
            conn.release();
        }
    },
};

export default Applicant;

