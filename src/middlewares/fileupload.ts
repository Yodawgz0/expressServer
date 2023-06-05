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

export const uploadFileHandler = async () => {
  return new Promise((resolve, reject) => {
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: "fileUpload" });
    fs.createReadStream("./cover letter.txt").pipe(
      bucket
        .openUploadStream("myFile", {
          chunkSizeBytes: 1048576,
          metadata: { field: "myField", value: "myValue" },
        })
        .on("finish", () => resolve("File Uploaded Successfully!"))
        .on("error", () => reject("There was some problem!"))
    );
  });
};
