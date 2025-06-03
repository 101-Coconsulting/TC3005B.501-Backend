import { ObjectId } from 'mongodb';
import { uploadFile, getFile } from './fileStorage.js';
import pool from "../database/config/db.js";

// Upload both PDF and XML files for a receipt
export async function uploadReceiptFiles(receiptId, pdfFile, xmlFile) {
  try {
    // Upload PDF file
    const pdfResult = await uploadFile(
      pdfFile.buffer,
      pdfFile.originalname,
      pdfFile.mimetype,
      { receiptId, fileType: 'pdf' }
    );

    // Upload XML file
    const xmlResult = await uploadFile(
      xmlFile.buffer,
      xmlFile.originalname,
      xmlFile.mimetype,
      { receiptId, fileType: 'xml' }
    );

    // Update the receipt record with both file IDs
    const conn = await pool.getConnection();
    try {
      await conn.query(
        `UPDATE Receipt
         SET pdf_file_id = ?, pdf_file_name = ?,
             xml_file_id = ?, xml_file_name = ?
         WHERE receipt_id = ?`,
        [
          pdfResult.fileId, pdfResult.fileName,
          xmlResult.fileId, xmlResult.fileName,
          receiptId
        ]
      );

      return {
        pdf: pdfResult,
        xml: xmlResult
      };
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error uploading receipt files:', error);
    throw error;
  }
}

// Get receipt file (PDF or XML)
export async function getReceiptFile(fileId) {
  try {
    return await getFile(fileId);
  } catch (error) {
    console.error('Error getting receipt file:', error);
    throw error;
  }
}

// Get receipt files metadata
export async function getReceiptFilesMetadata(receiptId) {
  const conn = await pool.getConnection();
  try {
    const [receipt] = await conn.query(
      `SELECT pdf_file_id, pdf_file_name, xml_file_id, xml_file_name
       FROM Receipt
       WHERE receipt_id = ?`,
      [receiptId]
    );

    if (!receipt) {
      throw new Error('Receipt not found');
    }

    return {
      pdf: {
        fileId: receipt.pdf_file_id,
        fileName: receipt.pdf_file_name
      },
      xml: {
        fileId: receipt.xml_file_id,
        fileName: receipt.xml_file_name
      }
    };
  } finally {
    conn.release();
  }
}
