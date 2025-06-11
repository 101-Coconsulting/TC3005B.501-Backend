import { ObjectId } from 'mongodb';
import sanitize from 'mongo-sanitize';
import { uploadReceiptFiles, getReceiptFile, getReceiptFilesMetadata } from '../services/receiptFileService.js';
import { db } from '../services/fileStorage.js';

// Upload both PDF and XML files for a receipt
export const uploadReceiptFilesController = async (req, res) => {
  // This might need to be changed to require at least one file.
  if (!req.files || !req.files.pdf || !req.files.xml) {
    return res.status(400).json({ error: 'Both PDF and XML files are required' });
  }

  // Sanitize the receipt ID
  const receiptId = parseInt(sanitize(req.params.receipt_id), 10);

  try {
    // Sanitize file metadata before uploading
    const pdfFile = req.files.pdf[0];
    const xmlFile = req.files.xml[0];
    
    // Sanitize filenames to prevent injection in metadata
    pdfFile.originalname = sanitize(pdfFile.originalname);
    xmlFile.originalname = sanitize(xmlFile.originalname);
    
    const result = await uploadReceiptFiles(
      receiptId,
      pdfFile,
      xmlFile
    );

    res.status(201).json({
      message: 'Files uploaded successfully',
      pdf: {
        fileId: result.pdf.fileId,
        fileName: result.pdf.fileName
      },
      xml: {
        fileId: result.xml.fileId,
        fileName: result.xml.fileName
      }
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get receipt file (PDF or XML)
export const getReceiptFileController = async (req, res) => {
  try {
    // Sanitize the file ID
    const fileIdStr = sanitize(req.params.file_id);
    
    // Validate it's a proper ObjectId before querying MongoDB
    if (!ObjectId.isValid(fileIdStr)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }
    
    const fileId = new ObjectId(fileIdStr);

    // Get file metadata from MongoDB
    const file = await db.collection('fs.files').findOne({ _id: fileId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers with sanitized values
    res.set('Content-Type', sanitize(file.contentType));
    res.set('Content-Disposition', `attachment; filename="${sanitize(file.filename)}"`);

    // Stream the file to the response
    const downloadStream = await getReceiptFile(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get receipt files metadata
export const getReceiptFilesMetadataController = async (req, res) => {
  // Sanitize the receipt ID
  const receiptId = parseInt(sanitize(req.params.receipt_id), 10);

  try {
    const metadata = await getReceiptFilesMetadata(receiptId);
    res.json(metadata);
  } catch (error) {
    console.error('Error getting receipt files metadata:', error);
    if (error.message === 'Receipt not found') {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
