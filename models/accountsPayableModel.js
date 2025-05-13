/*
CPP Model
Miguel Soria 09/05/25
Queries to the DB related to CPP actions
*/
import pool from "../database/config/db.js";

const AccountsPayable = {
    // Update request status to 5 (Atención Agencia de Viajes)
    async attendTravelRequest(requestId) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                "UPDATE `Request` SET request_status_id = 5 WHERE request_id = ?",
                [requestId],
            );

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
                "SELECT request_id FROM `Request` WHERE request_id = ?",
                [requestId],
            );

            return rows.length > 0;
        } catch (error) {
            console.error("Error checking if request exists:", error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    },

    async getExpenseValidations(requestId, status) {
        let conn;
        try {
            conn = await pool.getConnection();

            let query;
            // Status will be done as a 'filter' for the query
            // If status is 'Todos', we will not filter by validation
            if (status === 'Todos') {
                query = `
        SELECT
            r.receipt_id,
            r.request_id,
            r.validation,
            rt.receipt_type_name
        FROM
            Receipt r
        JOIN
            Receipt_type rt ON r.receipt_type_id = rt.receipt_type_id
        WHERE
            r.request_id = ?
    `;
            }
            // If status is not 'Todos', we will filter by validation
            // to get only the receipts with the given status
            else {
                query = `
        SELECT
            r.receipt_id,
            r.request_id,
            r.validation,
            rt.receipt_type_name
        FROM
            Receipt r
        JOIN
            Receipt_type rt ON r.receipt_type_id = rt.receipt_type_id
        WHERE
            r.request_id = ? AND r.validation = ?
    `;
            }

            // Execute the query with the requestId and status
            const rows = await conn.query(query, [requestId, status]);
            if (rows.length === 0) {
                return {
                    request_id: requestId,
                    Expenses: []
                };
            }

            // Check if any of the rows have validation 'Pendiente'
            // If any of the rows have validation 'Pendiente', set expense_status to 'Pendiente'
            const hasPendingValidation = rows.some(row => row.validation === 'Pendiente');
            const expense_status = hasPendingValidation ? 'Pendiente' : 'Aprobado';

            // Format the response
            // We will return the request_id, status and the list of expenses
            const formatted = {
                request_id: requestId,
                status: expense_status,
                Expenses: rows.map(row => ({
                    receipt_id: row.receipt_id,
                    receipt_type_name: row.receipt_type_name,
                    amount: row.amount,
                    Expense_Status: row.validation
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
