import crypto from 'crypto';
const AES_SECRET_KEY = process.env.AES_SECRET_KEY;

export const decrypt = (encryptedData) => {
  try {
    if (!encryptedData || typeof encryptedData !== 'string') {
      return encryptedData; 
    }

    const IV = Buffer.from(encryptedData.slice(0, 32), 'hex');
    const cipherText = encryptedData.slice(32);

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_SECRET_KEY), IV);
    let decrypted = decipher.update(cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData; 
  }
}
