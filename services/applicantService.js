export const fillRequestTable = async (
  conn, status, notes, requested_fee, imposed_fee, request_date,
  request_time, last_mod_date, last_mod_time, active, user_id
) => {

  try {
    const insertRequestTable = `
      INSERT INTO Request (
        status, notes, requested_fee, imposed_fee, request_date,
        request_time, last_mod_date, last_mod_time, active, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await conn.execute(insertRequestTable, [
      status, notes, requested_fee, imposed_fee, request_date,
      request_time, last_mod_date, last_mod_time, active, user_id,
    ]);

  } catch (error) {
    console.error("Error inserting into Request table:", error);
    throw new Error("Database Error: Unable to insert into Request table");
  }

};

export const fillRouteTable = async (
  conn, router_index, plane_needed, hotel_needed,
  beginning_date, beginning_time, ending_date, ending_time,
  id_origin_country, id_origin_city, id_destination_country, id_destination_city
) => {

  try {
    const insertRouteTable = `
      INSERT INTO Route (
        router_index, plane_needed, hotel_needed,
        beginning_date, beginning_time, ending_date, ending_time,
        id_origin_country, id_origin_city, id_destination_country, id_destination_city
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await conn.execute(insertRouteTable, [
      router_index, plane_needed, hotel_needed,
      beginning_date, beginning_time, ending_date, ending_time,
      id_origin_country, id_origin_city, id_destination_country, id_destination_city,
    ]);

  } catch (error) {
    console.error("Error inserting into Route table:", error);
    throw new Error("Database Error: Unable to insert into Route table");
  }

};

export const fillRoute_RequestTable = async (conn, route_id, request_id) => {
  try {
    const insertRouteRequestTable = `
      INSERT INTO Route_Request (route_id, request_id)
      VALUES (?, ?)
    `;

    await conn.execute(insertRouteRequestTable, [route_id, request_id]);

  } catch (error) {
    console.error("Error inserting into Route_Request table:", error);
    throw new Error("Database Error: Unable to insert into Route_Request table");
  }
};