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

export default {
    getAlerts,
    // other functions go here
};

