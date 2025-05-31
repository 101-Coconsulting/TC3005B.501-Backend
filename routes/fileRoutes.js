import express from 'express';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import { uploadReceiptFiles, getReceiptFile, getReceiptFilesMetadata } from '../services/receiptFileService.js';
import { db } from '../services/fileStorage.js';

const router = express.Router();
const upload = multer();

// Upload both PDF and XML files for a receipt
router.post('/upload-receipt-files/:receipt_id',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'xml', maxCount: 1 }
  ]),
  async (req, res) => {
    // This might need to be changed to require at least one file.
    if (!req.files || !req.files.pdf || !req.files.xml) {
      return res.status(400).json({ error: 'Both PDF and XML files are required' });
    }

    const receiptId = parseInt(req.params.receipt_id, 10);

    try {
      const result = await uploadReceiptFiles(
        receiptId,
        req.files.pdf[0],
        req.files.xml[0]
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
  }
);

// Get receipt file (PDF or XML)
router.get('/receipt-file/:file_id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.file_id);

    // Get file metadata from MongoDB
    const file = await db.collection('fs.files').findOne({ _id: fileId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

    // Stream the file to the response
    const downloadStream = await getReceiptFile(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get receipt files metadata
router.get('/receipt-files/:receipt_id', async (req, res) => {
  const receiptId = parseInt(req.params.receipt_id, 10);

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
});

export default router;
