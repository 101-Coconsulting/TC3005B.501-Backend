/*
Authorizer services
*/
import Authorizer from "../models/authorizerModel.js";

const authorizeRequest = async (request_id, user_id) => {
  try {
    const role_id = await Authorizer.getUserRole(user_id);
    if (!role_id) {
      throw { status: 404, message: "User not found" };
    }

    let new_status_id;
    if (role_id === 4) { // N1
      new_status_id = 3; // Primera Revisión
    } else if (role_id === 5) { // N2
      new_status_id = 4; // Segunda Revisión
    } else {
      throw { status: 400, message: "User role not authorized to approve request" };
    }

    await Authorizer.authorizeTravelRequest(request_id, new_status_id);

    return {
        new_status: role_id === 4 ? "Segunda Revisión" : "Cotizacion de Viaje"
      };
      
  } catch (err) {
    console.error("Error in authorizeRequest service:", err);
    throw err;
  }
};

const declineRequest = async (request_id, user_id) => {
  try {
    const role_id = await Authorizer.getUserRole(user_id);
    if (!role_id) {
      throw { status: 404, message: "User not found" };
    }

    if (![4, 5].includes(role_id)) {
      throw { status: 400, message: "User role not authorized to decline request" };
    }

    await Authorizer.declineTravelRequest(request_id);

    return {
      message: "Request declined successfully",
      new_status: "Rechazado"
    };
  } catch (err) {
    console.error("Error in declineRequest service:", err);
    throw err;
  }
};

export default {
  authorizeRequest,
  declineRequest,

};
