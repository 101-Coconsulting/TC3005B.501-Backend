import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
const AES_SECRET_KEY = process.env.AES_SECRET_KEY;
const AES_IV = process.env.AES_IV;
import { parse } from 'csv-parse';
import fs, { unlink } from 'fs';
import { decrypt } from '../middleware/decryption.js';

const requiredColumns = ['role_name', 'department_name', 'user_name', 'password', 'workstation', 'email'];

const encrypt = (data) => {
  const IV = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_SECRET_KEY), IV);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return IV.toString('hex') + encrypted;
}

const hash = async (data) => {
  return await bcrypt.hash(data, 10);
}

/*
 * Create a new user (admin functionality)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user data
 */
export async function createUser(userData) {
  try {
    const hashedPassword = await hash(userData.password);
    const encryptedEmail = encrypt(userData.email);
    const encryptedPhone = encrypt(userData.phone_number);

    const newUser = {
      role_id: userData.role_id,
      department_id: userData.department_id,
      user_name: userData.user_name,
      password: hashedPassword,
      workstation: userData.workstation,
      email: encryptedEmail,
      phone_number: encryptedPhone
    };
    console.log(newUser);

    return await Admin.createUser(newUser);
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const validateUserRow = async (rowData, rowNumber) => {
  const rowErrors = [];

  requiredColumns.forEach(col => {
    if (rowData[col] === null || rowData[col] === undefined || String(rowData[col]).trim() === ''){
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
};

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
      rowErrors.push (`Invalid department name: '${userData.department_name}'`);
    } else {
      userData.department_id = departmentId;
    }

    const hashedPassword = await hash(userData.password);
    userData.password = hashedPassword;

    const encryptedEmail = encrypt(userData.email);
    userData.email = encryptedEmail;

    const encryptedPhone = encrypt(userData.phone_number);
    userData.phone_number = encryptedPhone;

  } catch (error) {
    rowErrors.push(`Error processing row ${rowNumber}`);
  }

  if (rowErrors.length > 0){
    return { row_number: rowNumber, error: rowErrors.join(', ') };
  }

  delete userData.role_name;
  delete userData.department_name;

  return userData;
};

export const parseCSV = async (filePath, dummy) => {
  const results = {
    total_records: 0,
    created: 0,
    failed: 0,
    errors: []
  };
  let rowNumber = 0;
  const usersToCreate = [];

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);

    const stream = fs.createReadStream(filePath);
    const parser = stream.pipe(parse({
      columns: true,
      skip_empty_lines: true,
      trim: true
    }));

    stream.on("error", (err) => {
      parser.emit('error', err);
    });

    parser.on("error", (err) => {
      results.errors.push({
        row_number: 'N/A',
        error: `CSV parsing failed ${err.message}`
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
    if (!dummy) {
      try {
        await fs.promises.unlink(filePath);
      } catch (unlinkError) {
          results.errors.push({
          row_number: 'N/A',
          error: `Error unlinking CSV file: ${unlinkError.message}`
        });
      }
    }
  }

  return results;
};

/**
 * Get list of all users (admin functionality)
 * @returns {Promise<Array>} List of users
 */
export async function getUserList() {
  try {
    const users = await Admin.getUserList();

    return users.map(user => {
      const decryptedUser = { ...user };
      decryptedUser.email = decrypt(user.email);
      decryptedUser.phone_number = decrypt(user.phone_number);
      return decryptedUser;
    });
  } catch (error) {
    throw new Error(`Error fetching user list: ${error.message}`);
  }
};

export const updateUserData = async (userId, newUserData) => {
    const userData = await User.getUserData(userId);
    if (!userData) {
        throw { status: 404, message: 'No information found for the user' };
    }

    const isEmail = await Admin.findUserByEmail(newUserData.email);
    if (isEmail) {
        throw { status: 400, message: 'Email already in use' };
    }

    const updatedFields = [];
    const fieldsToUpdateInDb = {};
    const keysToCompare = ['role_name', 'department_name', 'user_name', 'workstation', 'email', 'phone_number'];

    for (const key of keysToCompare) {
        if (newUserData[key] !== undefined && newUserData[key] !== userData[key]) {
            updatedFields.push(key);
            if (key === 'role_name') {
                const roleID = await Admin.findRoleID(newUserData[key]);
                if (roleID !== null) {
                    fieldsToUpdateInDb.role_id = roleID;
                } else {
                    throw { status: 400, message: `Invalid role name provided: ${newUserData[key]}` };
                }
            } else if (key === 'department_name') {
                const deptId = await Admin.findDepartmentID(newUserData[key]);
                if (deptId !== null) {
                    fieldsToUpdateInDb.department_id = deptId;
                } else {
                    throw { status: 400, message: `Invalid department name provided: ${newUserData[key]}` };
                }
            } else if(key === 'email' || key === 'phone_number'){
                fieldsToUpdateInDb[key] = encrypt(newUserData[key])
            } else {
                fieldsToUpdateInDb[key] = newUserData[key];
            }
        }
    }

    if (Object.keys(fieldsToUpdateInDb).length > 0) {
        await Admin.updateUser(userId, fieldsToUpdateInDb);
        return { message: 'User updated successfully', updated_fields: updatedFields };
    }

    return { message: 'No changes detected, user data is up to date' };
};

export default {
  createUser,
  getUserList,
  parseCSV,
  updateUserData
};
