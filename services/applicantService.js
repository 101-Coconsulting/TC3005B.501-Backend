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

  export const cancelTravelRequestValidation = async (request_id) => {
    try {
      const status_id = await Applicant.getRequestStatus(request_id);
      if (status_id === null) {
        throw { status: 404, message: "Travel request not found" };
      }

      if (![1, 2, 3, 4, 5].includes(status_id)) {
        throw {
          status: 400,
          message: "Request cannot be cancelled after reaching 'Atención Agencia de Viajes'"
        };
      }

      await Applicant.cancelTravelRequest(request_id);

      return {
        message: "Travel request cancelled successfully",
        request_id,
        request_status_id: 9,
        active: false
      };
    } catch (err) {
      console.error("Error in cancelTravelRequest service:", err);
      throw err;
    }
  };