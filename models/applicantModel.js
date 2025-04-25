/*
Applicant Model
*/
import pool from '../database/config/db.js';

// Travel Request Imports
import { fillRequestTable, fillRouteTable, fillRoute_RequestTable } from '../services/applicantService.js';

export const Applicant = {
  // Find applicant by ID
  async findById(id) {
    let conn;
    console.log(`Searching for user with id: ${id}`);
    try {
      conn = await pool.getConnection();
<<<<<<< Updated upstream
      const rows = await conn.query('SELECT * FROM user WHERE user_id = ?', [id]);
      console.log(rows[0]);
=======
      const rows = await conn.query('SELECT * FROM User WHERE id = ?', [id]);
      console.log(`User found: ${(rows[0]).name}`);
>>>>>>> Stashed changes
      return rows[0];

    } catch (error) {
      console.error('Error finding applicant by ID:', error);
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  },
};


export const TravelRequest = {
  async createTravelRequest(user_id, travelDetails) {
    let conn;
    try {
      // Step 1: Get a DB connection
      conn = await pool.getConnection();

      // Step 2: Start a transaction to ensure atomic operations
      await conn.beginTransaction();

      // Destructure travel details from request body
      const {
        notes,
        requested_fee = 0, // if requested fee is not specified, default to 0
        imposed_fee = 0,   // if imposed fee is not specified, default to 0
        id_origin_country,
        id_origin_city,
        id_destination_country,
        id_destination_city,
        beginning_date,
        beginning_time,
        ending_date,
        ending_time,
        plane_needed = false, // default to false if not specified
        hotel_needed = false, // default to false if not specified
        additionalRoutes = [] // default to empty array if not specified
      } = travelDetails;

      // Step 3: Insert a new record into the Request table
      fillRequestTable(
        conn, 'Pending', notes, requested_fee, imposed_fee,
        new Date().toISOString().slice(0, 10), // request_date
        new Date().toISOString().slice(11, 19), // request_time
        new Date().toISOString().slice(0, 10), // last_mod_date
        new Date().toISOString().slice(11, 19), // last_mod_time
        true, // active
        user_id // user_id from the request body
      );
      // Step 7: Commit the transaction (everything went well)
      await conn.commit();

      console.log(`Travel request created with ID: ${requestId}`);
      return {
        requestId,
        message: "Travel request successfully created"
      };

    } catch (error) {
      // If something goes wrong, rollback the entire transaction
      if (conn) await conn.rollback();
      console.error('Error creating travel request:', error);
      throw error;
    } finally {
      // Step 8: Release the DB connection back to the pool
      if (conn) conn.release();
    }
  }
};
