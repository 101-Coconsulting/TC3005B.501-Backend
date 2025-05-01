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
      new_status_id = 2; // Primera Revisión
    } else if (role_id === 5) { // N2
      new_status_id = 3; // Segunda Revisión
    } else {
      throw { status: 400, message: "User role not authorized to approve request" };
    }

    await Authorizer.authorizeTravelRequest(request_id, new_status_id);

    return {
        new_status: role_id === 4 ? "Primera Revisión" : "Segunda Revisión"
      };
      
  } catch (err) {
    console.error("Error in authorizeRequest service:", err);
    throw err;
  }
};

export default {
  authorizeRequest,

};