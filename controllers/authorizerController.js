/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";

const declineTravelRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const userRequest = await Authorizer.declineTravelRequest(id);
        if (!userRequest) {
            return res.status(404).json({error: "No user request found"});
        }
    } catch(err) {
        res.status(500).json({error: "CONTROLLER: Internal server error"});
    }
}

export default {
    declineTravelRequest,
    // other functions go here
};