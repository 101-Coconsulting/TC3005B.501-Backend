/*
Applicant Model
*/
import pool from "../database/config/db.js";
import { formatRoutes, getRequestDays } from "../services/applicantService.js";

export const Applicant = {
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
<<<<<<< HEAD

=======
>>>>>>> bce138b2647f6cd69705fa55562a57049c51eabd
    } catch (error) {
      console.error("Error finding applicant by ID:", error);
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
<<<<<<< HEAD
=======
    }
  },

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

      const insertIntoRequestTable = `
        INSERT INTO Request (
          user_id, request_status_id, notes, requested_fee, imposed_fee, request_days
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const requestTableResult = await conn.execute(insertIntoRequestTable, [
        user_id,
        1,
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

          let id_origin_country,
            id_destination_country,
            id_origin_city,
            id_destination_city;

          // Search if the country exists in the database
          const countryQuery = `
          SELECT country_id FROM country WHERE country_name = ?
        `;
          const [OriginCountryRows] = await conn.query(countryQuery, [
            route.origin_country_name,
          ]);
          if (OriginCountryRows === undefined) {
            // If not, insert the country
            const insertCountryQuery = `
            INSERT INTO country (country_name) VALUES (?)
          `;
            const insertedOriginCountry = await conn.execute(
              insertCountryQuery,
              [route.origin_country_name],
            );
            id_origin_country = insertedOriginCountry.insertId;
          } else {
            // If it exists, get the ID
            id_origin_country = OriginCountryRows.country_id;
          }

          const [DestinationCountryRows] = await conn.query(countryQuery, [
            route.destination_country_name,
          ]);
          if (DestinationCountryRows === undefined) {
            console.log(
              "Inserting new country:",
              route.destination_country_name,
            );
            // If not, insert the country
            const insertCountryQuery = `
            INSERT INTO Country (country_name) VALUES (?)
          `;
            const insertedDestinationCountry = await conn.execute(
              insertCountryQuery,
              [route.destination_country_name],
            );
            id_destination_country = insertedDestinationCountry.insertId;
          } else {
            console.log(
              "Country already exists:",
              route.destination_country_name,
            );
            // If it exists, get the ID
            id_destination_country = DestinationCountryRows.country_id;
          }

          // Search if the city exists in the database
          const cityQuery = `
          SELECT city_id FROM city WHERE city_name = ?
        `;

          const [OriginCityRows] = await conn.query(cityQuery, [
            route.origin_city_name,
          ]);
          if (OriginCityRows === undefined) {
            // If not, insert the city
            const insertCityQuery = `
            INSERT INTO city (city_name) VALUES (?)
          `;
            const insertedOriginCity = await conn.execute(insertCityQuery, [
              route.origin_city_name,
            ]);

            id_origin_city = insertedOriginCity.insertId;
          } else {
            // If it exists, get the ID
            id_origin_city = OriginCityRows.city_id;
          }

          const [DestinationCityRows] = await conn.query(cityQuery, [
            route.destination_city_name,
          ]);

          if (DestinationCityRows === undefined) {
            // If not, insert the city
            const insertCityQuery = `
            INSERT INTO city (city_name) VALUES (?)
          `;
            const insertedDestinationCity = await conn.execute(
              insertCityQuery,
              [route.destination_city_name],
            );

            id_destination_city = insertedDestinationCity.insertId;
          } else {
            // If it exists, get the ID
            id_destination_city = DestinationCityRows.city_id;
          }

          // Insert into Route table

          const insertRouteTable = `
          INSERT INTO route (
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
          INSERT INTO route_request (request_id, route_id) VALUES (?, ?)
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
>>>>>>> bce138b2647f6cd69705fa55562a57049c51eabd
    }
  },

  // Edit travel request
  async editTravelRequest(request_id, travelChanges) {
    let conn;
    try {

      conn = await pool.getConnection();
      await conn.beginTransaction();

      // Update travel request



      // Commit transaction
      await conn.commit();
      return { message: 'Travel request updated successfully' };

    } catch (error) {
      if (conn) await conn.rollback();
      console.error('Error editing travel request:', error);
      throw new Error('Error editing travel request');
    }
    finally {
      if (conn) conn.release();
    }
  }

};

