import Applicant from "../models/applicantModel.js";

// Join the two arrays into one object
export const formatRoutes = (mainRoute, additionalRoutes = []) => {
    return [
        {
            origin_country_name: mainRoute.origin_country_name,
            origin_city_name: mainRoute.origin_city_name,
            destination_country_name: mainRoute.destination_country_name,
            destination_city_name: mainRoute.destination_city_name,
            router_index: mainRoute.router_index,
            beginning_date: mainRoute.beginning_date,
            beginning_time: mainRoute.beginning_time,
            ending_date: mainRoute.ending_date,
            ending_time: mainRoute.ending_time,
            plane_needed: mainRoute.plane_needed,
            hotel_needed: mainRoute.hotel_needed,
        },
        ...additionalRoutes.map((route) => ({
            router_index: route.router_index,
            origin_country_name: route.origin_country_name || 'notSelected',
            origin_city_name: route.origin_city_name || 'notSelected',
            destination_country_name: route.destination_country_name || 'notSelected',
            destination_city_name: route.destination_city_name || 'notSelected',
            beginning_date: route.beginning_date || '0000-01-01',
            beginning_time: route.beginning_time || '00:00:00',
            ending_date: route.ending_date || '0000-01-01',
            ending_time: route.ending_time || '00:00:00',
            plane_needed: route.plane_needed || false,
            hotel_needed: route.hotel_needed || false,
        })),
    ];
};

// Function to calculate the total number of days from the routes
export const getRequestDays = (routes) => {
    if (!routes || routes.length === 0) return 0;

    // Sort routes by router_index
    const sortedRoutes = routes.sort((a, b) => a.router_index - b.router_index);

    const firstRoute = sortedRoutes[0];
    const lastRoute = sortedRoutes[sortedRoutes.length - 1];

    // Combine date and time strings to create full datetime objects
    const startDate = new Date(
        `${firstRoute.beginning_date}T${firstRoute.beginning_time}`,
    );
    const endDate = new Date(
        `${lastRoute.ending_date}T${lastRoute.ending_time}`,
    );

    // Calculate the difference in milliseconds
    const diffInMs = endDate - startDate;

    // Convert milliseconds to days (with decimal)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Use ceil to always round up if there's any partial day
    const dayDiff = Math.ceil(diffInDays);

    return dayDiff;
};

export const cancelTravelRequestValidation = async (request_id) => {
    try {
        const status_id = await Applicant.getRequestStatus(request_id);
        if (status_id === null) {
            throw { status: 404, message: "Travel request not found" };
        }

        if (![1, 2, 3, 4, 5, 9].includes(status_id)) {
            throw {
                status: 400,
                message:
                    "Request cannot be cancelled after reaching 'Atención Agencia de Viajes'",
            };
        } else if (status_id == 9) {
            throw {
                status: 400,
                message: "Request has already been cancelled.",
            };
        }

        await Applicant.cancelTravelRequest(request_id);

        return {
            message: "Travel request cancelled successfully",
            request_id,
            request_status_id: 9,
            active: false,
        };
    } catch (err) {
        console.error("Error in cancelTravelRequest service:", err);
        throw err;
    }
};

export async function createExpenseValidationBatch(receipts) {
    if (!Array.isArray(receipts) || receipts.length === 0) {
        const err = new Error('The "receipts" field must be a non-empty array');
        err.code = "BAD_REQUEST";
        throw err;
    }

    for (const r of receipts) {
        if (
            typeof r.receipt_type_id !== "number" ||
            typeof r.request_id !== "number" ||
            typeof r.amount !== "number"
        ) {
            const err = new Error(
                'Each receipt must include "receipt_type_id", "request_id", and "amount" (all as numbers)'
            );
            err.code = "BAD_REQUEST";
            throw err;
        }
    }

    const insertedCount = await Applicant.createExpenseBatch(receipts);
    return insertedCount;
}

// Check if the country exists in the database If not, insert it
export const getCountryId = async (conn, countryName) => {
    console.log("Checking country:", countryName);
    const countryQuery = `SELECT country_id FROM Country WHERE country_name = ?`;
    const [CountryRows] = await conn.query(countryQuery, [countryName]);
    //If country does not exist, insert it
    if (CountryRows === undefined) {
        console.log("Country not found, inserting:", countryName);
        const insertCountryQuery = `INSERT INTO Country (country_name) VALUES (?)`;
        const insertedCountry = await conn.execute(insertCountryQuery, [
            countryName,
        ]);
        return insertedCountry.insertId;
    } else {
        //If country exists, return the id
        return CountryRows.country_id;
    }
};

export const getCityId = async (conn, cityName) => {
    console.log("Checking city:", cityName);
    const cityQuery = `SELECT city_id FROM City WHERE city_name = ?`;
    const [CityRows] = await conn.query(cityQuery, [cityName]);
    //If city does not exist, insert it
    if (CityRows === undefined) {
        const insertCityQuery = `INSERT INTO City (city_name) VALUES (?)`;
        const insertedCity = await conn.execute(insertCityQuery, [cityName]);
        return insertedCity.insertId;
    } else {
        //If city exists, return the id
        return CityRows.city_id;
    }
};

export async function sendReceiptsForValidation(requestId) {
  const currentStatus = await Applicant.getRequestStatus(requestId);

  if (currentStatus === null) {
    const err = new Error(`No request found with id ${requestId}`);
    err.status = 404;
    throw err;
  }

  if (currentStatus !== 6) {
    const err = new Error(
      "Request must be in status 6 (Comprobación gastos del viaje) to send for validation"
    );
    err.status = 400;
    throw err;
  }

  await Applicant.updateRequestStatusToValidationStage(requestId);

  return {
    request_id: Number(requestId),
    updated_status: 7,
    message: "Request status updated to 'Validación de comprobantes'",
  };
}

