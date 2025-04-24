import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';

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
 *       "400":
 *         description: Invalid user ID format
 *       "404":
 *         description: No information found for the user
 *       "500":
 *         description: Internal server error
 */
router.get('/:user_id', userController.getUserData);

export default router;