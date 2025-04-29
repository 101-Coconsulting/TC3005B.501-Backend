import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';

/**
/get-user-data/{user_id}:
    get:
      summary: Returns the data of the user.
      parameters:
        - name: user_id
          in: path
          required: true
          description: ID of the user in the database
          schema:
            type: integer
      security:
        - TokenAuth: [] # This endpoint requires a token
      responses:
        "200":
          description: All User's data
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id:
                    type: integer
                  user_name:
                    type: string
                  email:
                    type: string
                  phone_number:
                    type: string
                  workstation:
                    type: string
                  department_name:
                    type: string
                  costs_center:
                    type: string
                  creation_date:
                    type: string
                    format: date-time
                  role_name:
                    type: string
                example:
                  user_id: 1
                  user_name: "Arturo López"
                  email: "arturoperez59@hotmail.com"
                  phone_number: "(719) 860-5684"
                  workstation: "Arturo's workstation"
                  department_name: "Technology Department"
                  costs_center: "TECH01"
                  creation_date: "2021-04-17T00:00:00Z"
                  role_name: "N2"
        "401":
          description: Invalid or missing authentication token
        "404":
          description: No information found for the user
        "500":
          description: Internal server error
*/
router.get('/users/:user_id', userController.getUserData);

export default router;