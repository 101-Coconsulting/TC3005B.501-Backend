/*
Authorizer services
*/
import Authorizer from "../models/authorizerModel.js";

const getRequestStatusId = async (id) => {
    try {
        const idRequest = await Authorizer.getStatusId(id);
        console.log("ID recibido:", idRequest);
        if (!idRequest) {
            return null;
        }
        else {
            if (idRequest == 1)
                return 2;
            else if (idRequest == 2)
                return 3;
            else
            console.error("Error request ya autorizada, declinada o cancelada:", err);
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