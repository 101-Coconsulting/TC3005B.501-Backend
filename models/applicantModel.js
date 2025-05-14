/*
Applicant Model
*/
import pool from "../database/config/db.js";
import { formatRoutes, getRequestDays, getCountryId, getCityId } from "../services/applicantService.js";

const Applicant = {
    // Find applicant by ID
    async findById(id) {
        let conn;
        console.log(`Searching for user with id: ${id}`);
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM User WHERE user_id = ?", [
                id,
            ]);
            console.log(`User found: ${rows[0].name}`);
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

    // =========================================
    // Find cost center by user ID
    // =========================================

    async findCostCenterByUserId(user_id) {
        let conn;

        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                `
                SELECT d.department_name, d.costs_center FROM user u
                JOIN department d
                ON u.department_id = d.department_id
                WHERE u.user_id = ?;
            `,
                [user_id],
            );
            console.log(rows[0]);
            return rows[0];

        } catch (error) {
            console.error("Error finding cost center by ID:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },

    // =========================================
    // Create travel request
    // =========================================

    async createTravelRequest(user_id, travelDetails) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();

            // Destructure travel details from request body
            const {
                router_index,
                notes,
                requested_fee = 0,
                imposed_fee = 0,
                origin_country_name,
                origin_city_name,
                destination_country_name,
                destination_city_name,
                beginning_date,
                beginning_time,
                ending_date,
                ending_time,
                plane_needed,
                hotel_needed,
                additionalRoutes = [],
            } = travelDetails;

            // Format the routes into a single array
            const allRoutes = formatRoutes(
                {
                    router_index,
                    origin_country_name,
                    origin_city_name,
                    destination_country_name,
                    destination_city_name,
                    beginning_date,
                    beginning_time,
                    ending_date,
                    ending_time,
                    plane_needed,
                    hotel_needed,
                },
                additionalRoutes,
            );

            // =======================================
            // Step 1: Insert into Request table
            // =======================================
            const request_days = getRequestDays(allRoutes);

            // Get Status from role
            const role = await conn.query(
                `SELECT role_id FROM User WHERE user_id = ?`,
                [user_id],
            );

            console.log("Role ID:", role[0].role_id);
            let request_status;
            if (role[0].role_id == 1) {
                console.log("Role ID:", role[0].role_id);
                request_status = 2; // 2 = First Revision
            }
            else if (role[0].role_id == 4) {
                console.log("Role ID:", role[0].role_id);
                request_status = 3; // 3 = Second Revision
            }
            else if (role[0].role_id == 5) {
                console.log("Role ID:", role[0].role_id);
                request_status = 4; // 4 = Trip Quote
            }
            else {
                throw new Error("User role in not allowed to create a travel request");
            }

            const insertIntoRequestTable = `
                INSERT INTO Request (
                user_id, request_status_id, notes, requested_fee, imposed_fee, request_days
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;

            const requestTableResult = await conn.execute(insertIntoRequestTable, [
                user_id,
                request_status,
                notes,
                requested_fee,
                imposed_fee,
                request_days,
            ]);

            const requestId = requestTableResult.insertId;

            // =======================================
            // Step 2: Insert into Country & City table
            // =======================================

            for (const route of allRoutes) {
                try {
                    console.log("Processing route:", route);

                    let
                        id_origin_country,
                        id_destination_country,
                        id_origin_city,
                        id_destination_city;

                    // Search if the country exists in the database
                    id_origin_country = await getCountryId(conn, route.origin_country_name);
                    id_destination_country = await getCountryId(conn, route.destination_country_name);

                    console.log("Country IDs:", id_origin_country, id_destination_country);

                    // Search if the city exists in the database
                    id_origin_city = await getCityId(conn, route.origin_city_name);
                    id_destination_city = await getCityId(conn, route.destination_city_name);

                    console.log("City IDs:", id_origin_city, id_destination_city);
                    // Insert into Route table

                    const insertRouteTable = `
                    INSERT INTO Route (
                        id_origin_country, id_origin_city,
                        id_destination_country, id_destination_city,
                        router_index, plane_needed, hotel_needed,
                        beginning_date, beginning_time,
                        ending_date, ending_time
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    let routeTableResult = await conn.query(insertRouteTable, [
                        id_origin_country,
                        id_origin_city,
                        id_destination_country,
                        id_destination_city,
                        route.router_index,
                        route.plane_needed,
                        route.hotel_needed,
                        route.beginning_date,
                        route.beginning_time,
                        route.ending_date,
                        route.ending_time,
                    ]);

                    const routeId = routeTableResult.insertId;

                    // ======================================
                    // Step 3: Insert into Route_Request table
                    // ======================================

                    const insertIntoRouteRequestTable = `
                    INSERT INTO Route_Request (request_id, route_id) VALUES (?, ?)
                    `;
                    await conn.query(insertIntoRouteRequestTable, [requestId, routeId]);
                } catch (error) {
                    console.error("Error processing route:", error);
                    throw new Error("Database Error: Unable to process route");
                }
            }

            await conn.commit();

            console.log(`Travel request created with ID: ${requestId}`);
            return {
                requestId: Number(requestId),
                message: "Travel request successfully created",
            };
        } catch (error) {
            if (conn) await conn.rollback();
            console.error("Error creating travel request:", error);
            throw new Error("Database Error: Unable to fill Request table");
        } finally {
            if (conn) conn.release();
        }
    },

    async editTravelRequest(requestId, travelChanges) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            console.log("Editing travel request with ID:", requestId);

            // Destructure travel details from request body
            const {
                router_index,
                notes,
                requested_fee = 0,
                imposed_fee = 0,
                origin_country_name,
                origin_city_name,
                destination_country_name,
                destination_city_name,
                beginning_date,
                beginning_time,
                ending_date,
                ending_time,
                plane_needed,
                hotel_needed,
                additionalRoutes = [],
            } = travelChanges;

            // Format the routes into a single array
            const allRoutes = formatRoutes(
                {
                    router_index,
                    origin_country_name,
                    origin_city_name,
                    destination_country_name,
                    destination_city_name,
                    beginning_date,
                    beginning_time,
                    ending_date,
                    ending_time,
                    plane_needed,
                    hotel_needed,
                },
                additionalRoutes
            );

            // =======================================
            // Step 1: Update Request table
            // =======================================
            const request_days = getRequestDays(allRoutes);

            // Log old data
            const [oldData] = await conn.query(
                `SELECT * FROM Request WHERE request_id = ?`,
                [requestId]
            );
            console.log("Old data:", oldData);

            const updateRequestTable = `
                UPDATE Request SET
                notes = ?,
                requested_fee = ?,
                imposed_fee = ?,
                request_days = ?,
                last_mod_date = CURRENT_TIMESTAMP
                WHERE request_id = ?
            `;

            await conn.execute(updateRequestTable, [
                notes,
                requested_fee, // Allow null values for requested_fee
                imposed_fee, // Allow null values for imposed_fee
                request_days, // Allow null values for request_days
                requestId, // Use the provided requestId to update the correct record
            ]);

            // Log new data
            const [newData] = await conn.query(
                `SELECT * FROM Request WHERE request_id = ?`,
                [requestId]
            );
            console.log("New data:", newData);

            // =======================================
            // Step 2: Delete old routes
            // =======================================

            const oldRoutesIds = await conn.query(
                `SELECT route_id FROM Route_Request WHERE request_id = ?`,
                [requestId]
            );

            // Delete old route request table data related to the request
            const deleteRouteRequest = `
                DELETE FROM Route_Request WHERE request_id = ?
            `;
            await conn.execute(deleteRouteRequest, [requestId]);

            // Delete old routes from Route_Request table
            for (const route_id of oldRoutesIds) {
                const deleteRoute = `
                DELETE FROM Route WHERE route_id = ?
                `;
                await conn.execute(deleteRoute, [route_id.route_id]);
            }


            // =======================================
            // Step 3: Edit Route & Route_Request table
            // =======================================

            for (const route of allRoutes) {
                try {

                    console.log("Processing route:", route);

                    let
                        id_origin_country,
                        id_destination_country,
                        id_origin_city,
                        id_destination_city;

                    // Search if the country exists in the database
                    id_origin_country = await getCountryId(conn, route.origin_country_name);
                    id_destination_country = await getCountryId(conn, route.destination_country_name);

                    // Search if the city exists in the database
                    id_origin_city = await getCityId(conn, route.origin_city_name);
                    id_destination_city = await getCityId(conn, route.destination_city_name);


                    // Insert into Route table

                    const insertRouteTable = `
                    INSERT INTO Route (
                        id_origin_country, id_origin_city,
                        id_destination_country, id_destination_city,
                        router_index, plane_needed, hotel_needed,
                        beginning_date, beginning_time,
                        ending_date, ending_time
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    let routeTableResult = await conn.query(insertRouteTable, [
                        id_origin_country,
                        id_origin_city,
                        id_destination_country,
                        id_destination_city,
                        route.router_index,
                        route.plane_needed,
                        route.hotel_needed,
                        route.beginning_date,
                        route.beginning_time,
                        route.ending_date,
                        route.ending_time,
                    ]);

                    const routeId = routeTableResult.insertId;

                    // ======================================
                    // Step 3: Insert into Route_Request table
                    // ======================================

                    const insertIntoRouteRequestTable = `
                    INSERT INTO Route_Request (request_id, route_id) VALUES (?, ?)
                    `;
                    await conn.query(insertIntoRouteRequestTable, [requestId, routeId]);
                } catch (error) {
                    console.error("Error processing route:", error);
                    throw new Error("Database Error: Unable to process route");
                }
            }

            // Commit the transaction
            await conn.commit();
            console.log(`Travel request ${requestId} updated successfully.`);
            return {
                requestId: Number(requestId),
                message: "Travel request successfully updated",
            };

        } catch (error) {
            // Rollback the transaction if something fails
            if (conn) await conn.rollback();
            console.error("Error editing travel request:", error);
            throw new Error("Database Error: Unable to edit travel request");
        } finally {
            if (conn) conn.release();
        }
    },

    async getRequestStatus(request_id) {
        let conn;
        const query = `SELECT request_status_id FROM Request WHERE request_id = ?`;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [request_id]);
            return rows.length > 0 ? rows[0].request_status_id : null;
        } catch (error) {
            console.error('Error getting request status:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

    async cancelTravelRequest(request_id) {
        let conn;
        const query = `
        UPDATE Request
        SET request_status_id = 9
        WHERE request_id = ?
        `;
        try {
            conn = await pool.getConnection();
            await conn.query(query, [request_id]);
            return true;
        } catch (error) {
            console.error('Error cancelling request:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

    async getCompletedRequests(id) {
        let conn;
        const query = `
        SELECT request_id,
            destination_countries,
            destination_cities,
            beginning_dates,
            ending_dates,
            creation_date,
            status
        FROM RequestWithRouteDetails
        WHERE user_id = ?
            AND status = 'Finalizado'
        `;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, [id]);
            return rows;
        } catch (error) {
            console.error('Error getting completed requests:', error);
            throw error;
        } finally {
            if (conn){
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
     * Inserts multiple receipts using receipt_type_id and amount.
     * @param {Array<{receipt_type_id: number, request_id: number, amount: number}>} receipts
     * @returns {number} number of inserted rows
     */
    async createExpenseBatch(receipts) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const insertedRows = [];

            for (const r of receipts) {
            const result = await conn.query(
                `INSERT INTO Receipt (receipt_type_id, request_id, amount)
                VALUES (?, ?, ?)`,
                [r.receipt_type_id, r.request_id, r.amount]
            );
            insertedRows.push(result);
            }

            await conn.commit();
            return insertedRows.length;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

};

export default Applicant;
