/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";
import Authorizer from "../models/authorizerController.js";

const authorizeTravelRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const idRequest = await Authorizer.getRequestStatusId(id)
        const userRequest = await Authorizer.authorizeTravelRequest(id, idRequest);
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