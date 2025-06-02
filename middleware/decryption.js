import crypto from 'crypto';
const AES_SECRET_KEY = process.env.AES_SECRET_KEY;
const AES_IV = process.env.AES_IV;

export const decrypt = (encryptedData) => {
  try {
    if (!encryptedData || typeof encryptedData !== 'string') {
      return encryptedData; 
    }

    const decipher = crypto. createDecipheriv('aes-256-cbc', Buffer.from(AES_SECRET_KEY), Buffer.from(AES_IV));
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData; 
  }
}
