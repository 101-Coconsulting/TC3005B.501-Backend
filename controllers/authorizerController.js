/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";

const getAlerts = async (req, res) => {
    const id = Number(req.params.dept_id);
    const status = Number(req.params.status_id);
    const n = Number(req.params.n);
    try {
      const userRequest = await Authorizer.getAlerts(id, status, n);
      if (!userRequest) {
        return res.status(404).json({error: "Not found"});
      }
      return res.status(200).json(userRequest);
    } catch (error) {
      return res.status(400).json({error: "Bad Request"});
    }
  }

const authorizeTravelRequest = async (req, res) => {
  const { id: request_id, user_id } = req.params;

  try {
    const { new_status } = await authorizerServices.authorizeRequest(Number(request_id), Number(user_id));
    return res.status(200).json({
      message: "Request status updated successfully",
      new_status
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Unexpected error in authorizeTravelRequest controller:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const declineTravelRequest = async (req, res) => {
  const { id: request_id, user_id } = req.params;

  try {
    const result = await authorizerServices.declineRequest(Number(request_id), Number(user_id));
    return res.status(200).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Unexpected error in declineTravelRequest controller:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default {
    getTravelRequest,
    getTravelRequestsDept,
    getAlerts,
    authorizeTravelRequest,
    declineTravelRequest,
    // other functions go here
};
