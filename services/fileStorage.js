import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'fileStorage';

let db;
let bucket;

// Connect to MongoDB
async function connectMongo() {
  try {
    const client = await MongoClient.connect(mongoUrl);
    db = client.db(dbName);
    bucket = new GridFSBucket(db);
    console.log('Connected to MongoDB for file storage');
    return { db, bucket };
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Upload a file to GridFS
async function uploadFile(fileBuffer, fileName, fileType, metadata = {}) {
  const readableStream = new Readable();
  readableStream.push(fileBuffer);
  readableStream.push(null);

  const uploadStream = bucket.openUploadStream(fileName, {
    contentType: fileType,
    metadata: {
      ...metadata,
      uploadDate: new Date()
    }
  });

  const fileId = uploadStream.id.toString();
  
  return new Promise((resolve, reject) => {
    readableStream.pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => {
        resolve({ fileId, fileName });
      });
  });
}

// Get a file stream from GridFS
async function getFile(fileId) {
  return bucket.openDownloadStream(new ObjectId(fileId));
}

export { connectMongo, uploadFile, getFile, db, bucket };
