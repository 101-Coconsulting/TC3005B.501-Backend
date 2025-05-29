/*
CPP Model
Miguel Soria 09/05/25
Queries to the DB related to CPP actions
*/
import pool from "../database/config/db.js";

const AccountsPayable = {
    // Update request status to 5 (Atención Agencia de Viajes)
    async attendTravelRequest(requestId, imposedFee, new_status, user_id) {
        let conn;
        const logQuery = `
            INSERT INTO Request_log (request_id, request_status_id, user_id)
            VALUES (?, ?, ?)
        `;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                `UPDATE Request SET request_status_id = ?, imposed_fee = ? 
                WHERE request_id = ?`,
                [new_status, imposedFee, requestId],
            );
            if (result.affectedRows > 0) {
                await conn.query(logQuery, [requestId, new_status, user_id]);
            }
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating travel request status:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },

    // Check if request exists in the DB, will be used in the model before the update
    async requestExists(requestId) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                 `SELECT request_id, request_status_id, hotel_needed_list, plane_needed_list 
                 FROM RequestWithRouteDetails WHERE request_id = ?`,
                [requestId],
            );
            return rows[0];
        } catch (error) {
            console.error("Error checking if request exists:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },

    async getExpenseValidations(requestId) {
        let conn;
        try {
            conn = await pool.getConnection();

            let query;

            query = `
            SELECT
                r.receipt_id,
                r.request_id,
                r.validation,
                r.amount,
                rt.receipt_type_name
            FROM
                Receipt r
            JOIN
                Receipt_Type rt ON r.receipt_type_id = rt.receipt_type_id
            WHERE
                r.request_id = ?
        `;

            // Execute the query with the requestId
            const rows = await conn.query(query, [requestId]);

            if (rows.length === 0) {
                return {
                    request_id: requestId,
                    Expenses: []
                };
            }

            // Check if any of the rows have validation 'Pendiente'
            const hasPendingValidation = rows.some(row => row.validation === 'Pendiente');
            const expense_status = hasPendingValidation ? 'Pendiente' : 'Sin Pendientes';

            // Sort the rows based on the validation status
            rows.sort((a, b) => {
                // Define the order for sorting
                const statusOrder = { "Pendiente": 1, "Rechazado": 2, "Aprobado": 3 };
                return statusOrder[a.validation] - statusOrder[b.validation];
            });
            // Format the response
            const formatted = {
                request_id: requestId,
                status: expense_status,
                Expenses: rows.map(row => ({
                    receipt_id: row.receipt_id,
                    receipt_type_name: row.receipt_type_name,
                    amount: row.amount, // Now including the amount field
                    validation: row.validation // We use the validation as Expense_Status
                }))
            };

            return formatted;

        } catch (error) {
            console.error("Error getting expense validations:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },
};

export default AccountsPayable;
