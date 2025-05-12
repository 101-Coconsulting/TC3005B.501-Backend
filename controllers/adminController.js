/*
Admin Controller
*/
import parseCSV from "../services/adminService.js";

const createUser = async(req, res) => {

}

const createMultipleUsers = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const filePath = req.file.path;

    try {
        const result = await parseCSV(filePath);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(result);
    }
}

export default {
    createMultipleUsers
}