
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
      hotel_needed: mainRoute.hotel_needed
    },
    ...additionalRoutes.map(route => ({
      origin_country_name: route.origin_country_name,
      origin_city_name: route.origin_city_name,
      destination_country_name: route.destination_country_name,
      destination_city_name: route.destination_city_name,
      router_index: route.router_index,
      beginning_date: route.beginning_date,
      beginning_time: route.beginning_time,
      ending_date: route.ending_date,
      ending_time: route.ending_time,
      plane_needed: route.plane_needed,
      hotel_needed: route.hotel_needed
    }))
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
  const startDate = new Date(`${firstRoute.beginning_date}T${firstRoute.beginning_time}`);
  const endDate = new Date(`${lastRoute.ending_date}T${lastRoute.ending_time}`);

  // Calculate the difference in milliseconds
  const diffInMs = endDate - startDate;

  // Convert milliseconds to days (with decimal)
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Use ceil to always round up if there's any partial day
  const dayDiff = Math.ceil(diffInDays);

  return dayDiff;
};

// Check if the country exists in the database If not, insert it
export const getCountryId = async (conn, countryName) => {
  console.log("Checking country:", countryName);
  const countryQuery = `SELECT country_id FROM country WHERE country_name = ?`;
  const [CountryRows] = await conn.query(countryQuery, [countryName]);
  //If country does not exist, insert it
  if (CountryRows === undefined) {
    console.log("Country not found, inserting:", countryName);
    const insertCountryQuery = `INSERT INTO country (country_name) VALUES (?)`;
    const insertedCountry = await conn.execute(insertCountryQuery, [countryName]);
    return insertedCountry.insertId;
  } else {
    //If country exists, return the id
    return CountryRows.country_id;
  }
};

export const getCityId = async (conn, cityName) => {
  console.log("Checking city:", cityName);
  const cityQuery = `SELECT city_id FROM city WHERE city_name = ?`;
  const [CityRows] = await conn.query(cityQuery, [cityName]);
  //If city does not exist, insert it
  if (CityRows === undefined) {
    const insertCityQuery = `INSERT INTO city (city_name) VALUES (?)`;
    const insertedCity = await conn.execute(insertCityQuery, [cityName]);
    return insertedCity.insertId;
  } else {
    //If city exists, return the id
    return CityRows.city_id;
  }
}