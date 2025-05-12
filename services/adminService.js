/*
Admin services
*/

import { parse } from 'csv-parse';
import fs, { unlink } from 'fs';
import Admin from "../models/adminModel.js";

const requiredColumns = ['role_name', 'department_name', 'user_name', 'password', 'workstation', 'email'];

const validateUserRow = async (rowData, rowNumber) => {
    const rowErrors = [];

    requiredColumns.forEach(col => {
        if (rowData[col] === null || rowData[col] === undefined || String(rowData[col]).trim() === '') {
             rowErrors.push(`Column '${col}' is required and cannot be empty`);
        }
    });

    const emailExists = await Admin.findUserByEmail(rowData.email);
        if (emailExists) {
            rowErrors.push(`Email '${rowData.email}' already exists`);
        }

    if (rowErrors.length > 0) {
        return { row_number: rowNumber, error: rowErrors.join(', ') };
    }

    return null;
}

const getForeignKeyValues = async (rowData, rowNumber) => {
    const rowErrors = [];
    let userData = {...rowData};

    try {
        const roleId = await Admin.findRoleID(userData.role_name);
        if (roleId === null) {
            rowErrors.push(`Invalid role name: '${userData.role_name}'`);
        } else {
            userData.role_id = roleId;
        }

        const departmentId = await Admin.findDepartmentID(userData.department_name);
        if (departmentId === null) {
            rowErrors.push(`Invalid department name: '${userData.department_name}'`);
        } else {
            userData.department_id = departmentId;
        }

    } catch (error) {
        rowErrors.push(`Error processing row ${rowNumber}`);
    }

    if (rowErrors.length > 0) {
        return { row_number: rowNumber, error: rowErrors.join(', ') };
    }

    delete userData.role_name;
    delete userData.department_name;

    return userData;
}

const parseCSV = async (filePath) => {
    const results = {
        total_records: 0,
        created: 0,
        failed: 0,
        errors: [],
      };
    let rowNumber = 0;
    const usersToCreate = [];
    
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);

        const stream = fs.createReadStream(filePath)
        const parser = stream.pipe(parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
        }));

        stream.on("error", (err) => {
            parser.emit('error', err);
        });

        parser.on("error", (err) => {
            results.errors.push({
                row_number: 'N/A',
                error: `CSV parsing failed: ${err.message}`
            });
        });

        for await (const record of parser) {
            rowNumber++;
            results.total_records++;

            const rowValidationError = await validateUserRow(record, rowNumber);

            if (rowValidationError) {
                results.failed++;
                results.errors.push(rowValidationError);
                continue;   
            }

            const idValidation = await getForeignKeyValues(record, rowNumber);

            if (idValidation && idValidation.error) {
                results.failed++;
                results.errors.push(idValidation);
            } else {
                usersToCreate.push(idValidation);
            }
        }

        if (usersToCreate.length > 0) {
            try {
                const createdCount = await Admin.createMultipleUsers(usersToCreate);
                results.created = createdCount;
                results.failed += (usersToCreate.length - createdCount);
            } catch (error) {
                results.errors.push({
                    row_number: 'N/A',
                    error: "Bulk insert failed"
                });
                results.failed += usersToCreate.length;
            }
        }
    } catch (error) {
        if (!results.errors.some(err => err.row_number === 'N/A' && err.error.includes('CSV parsing failed'))) {
            results.errors.push({
                row_number: 'N/A',
                error: `Error processing CSV file: ${error.message}`
            });
        }
        
        results.failed = results.total_records - results.created;
    } finally {
        try {
            await fs.promises.unlink(filePath);
        } catch (unlinkError) {
            results.errors.push({
                row_number: 'N/A',
                error: `Error unlinking CSV file: ${error.message}`
            });
        }
    }

    return results;
}

export default parseCSV;