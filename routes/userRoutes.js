import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { tokenAuth, authorize, selfOrAdmin } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     summary: Get user data by ID
 *     description: Retrieves all data for a specific user
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID of the user in the database
 *         schema:
 *           type: integer
 *     security:
 *       - TokenAuth: [] # This endpoint requires a token
 *     responses:
 *       "200":
 *         description: All User's data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 date_of_creation:
 *                   type: string
 *                   format: date-time
 *                 wallet_balance:
 *                   type: number
 *                   format: float
 *                 role_name:
 *                   type: string
 *               example:
 *                 id: 1
 *                 user_name: "Arturo López"
 *                 email: "arturoperez59@hotmail.com"
 *                 phone_number: "(719) 860-5684"
 *                 date_of_creation: "2021-04-17T00:00:00Z"
 *                 wallet_balance: 0.0
 *                 role_name: "Administrator"
 *       "401":
 *         description: Invalid or missing authentication token
 *       "404":
 *         description: No information found for the user
 *       "500":
 *         description: Internal server error
 */
// Users can access their own data, and administrators can access anyone's data
router.get('/:user_id', tokenAuth, selfOrAdmin(), userController.getUserData);

export default router;
