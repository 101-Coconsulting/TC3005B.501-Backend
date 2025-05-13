/*
Admin services
 */

import Admin from "../models/adminModel.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
const AES_SECRET_KEY = process.env.AES_SECRET_KEY;
const AES_IV = process.env.AES_IV;

function encrypt(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_SECRET_KEY), Buffer.from(AES_IV));
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

async function hash(data) {
  return await bcrypt.hash(data, 10);
}

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
}


export async function getUserList() {
  try {
    return await Admin.getUserList();
  } catch (error) {
    throw new Error(`Error fetching user list: ${error.message}`);
  }
}

const readCSV = async (file) => {

}

export default {
  createUser,
  getUserList,
  readCSV
};
