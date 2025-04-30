/*
Authorizer services
*/
import Authorizer from "../models/authorizerModel.js";

const getRequestStatusId = async (id) => {
    try {
        const idRequest = await Authorizer.getStatusId(id);
        console.log("ID a comprobar:", idRequest);
        if (!idRequest) {
            return null;
        }
        else {
            if (idRequest == 1)
                return 2;
            else if (idRequest == 2)
                return 3;
            else
            throw { status: 401, message: "La solicitud ya fue autorizada, declinada o cancelada" };
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