/*
Authorizer Controller
*/
import Authorizer from "../models/authorizerModel.js";

const getAlerts = (req, res) => {
  const id = req.params.dept_id;
  const status = req.params.status;
  const n = req.params.status;
  try {
    const userRequest = await Authorizer.getAlerts(id, status, n);
    if (!userRequest) {
      return res.status(404).json({error: "Not found"});
    }
    return res.status(200).json(userRequest);
  } catch (error) {
    return res.status(500).json({error: "Something went wrong on the server"});
  }
}

export default {

    getAlerts,
};

