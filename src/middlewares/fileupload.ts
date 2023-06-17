import { config } from "dotenv";
import { GridFSBucket, MongoClient, ServerApiVersion } from "mongodb";
import fs from "fs";
config();
// Replace the placeholder with your Atlas connection string
const uri: string = process.env["DB_URI"]!;
const dbName: string = process.env["DB_NAME"]!;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const uploadFileHandler = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: "fileUpload" });
    fs.createReadStream(file.path).pipe(
      bucket
        .openUploadStream(file.originalname, {
          chunkSizeBytes: 1048576,
          metadata: { field: "myField", value: "myValue" },
        })
        .on("finish", () => {
          fs.unlink(file.path, (error) => {
            if (error) {
              reject("Failed to delete the file.");
            } else {
              resolve("File Uploaded Successfully!");
            }
          });
        })
        .on("error", () => {
          fs.unlink(file.path, () => {
            reject("There was some problem!");
          });
        })
    );
  });
};
