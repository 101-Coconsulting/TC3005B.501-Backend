import pool from '../database/config/db.js';
import { createUser as userModelCreateUser } from './userModel.js';

const Admin = {
    async createUser(userData) {
        try {
            
            return await userModelCreateUser(userData);
        } catch (error) {
            throw error;
        }
    }
};

export default Admin;