/*
Authorizer services
*/
import Authorizer from "../models/authorizerModel.js";

const getRequestStatusId = async (id) => {
    try {
        const idRequest = await Authorizer.getStatusId(id);
        if (!idRequest) {
            return null;
        }
        else {
            if (idRequest == 2)
                return 4;
            else if (idRequest == 3)
                return 4;
            else
            throw { status: 401, message: "The requeste have been already authorized, declined or cancelled." };
        }
    } catch(err) {
        console.error("Error en getRequestStatusId:", err);
        throw err;
    }
}


export default {
    getRequestStatusId,
    // other functions go here
};