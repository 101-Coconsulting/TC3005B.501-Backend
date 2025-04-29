/*
Authorizer services
*/
import Authorizer from "../models/authorizerModel.js";

const getRequestStatusId = async (req, res) => {
    const id = req.params.id;
    try {
        const idRequest = await Authorizer.getStatusId(id)
        if (!idRequest) {
            return res.status(404).json({error: "No user request found"});
        }
        else {
            if (idRequest == 1)
                return status_id = 2;
            else
                return status_id = 3;
        }        
    } catch(err) {
        res.status(500).json({error: "CONTROLLER: Internal server error"});
    }
}


export default {
    getRequestStatusId,
    // other functions go here
};