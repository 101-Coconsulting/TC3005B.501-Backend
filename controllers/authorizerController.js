/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";

const authorizeTravelRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const idRequest = await Authorizer.getStatusId(id)
        if (idRequest == 1)
            status_id = 2;
        else
            status_id = 3;
        const userRequest = await Authorizer.authorizeTravelRequest(id, status_id);
        if (!userRequest) {
            return res.status(404).json({error: "No user request found"});
        }
    } catch(err) {
        res.status(500).json({error: "CONTROLLER: Internal server error"});
    }
}


export default {
    authorizeTravelRequest,
    // other functions go here
};