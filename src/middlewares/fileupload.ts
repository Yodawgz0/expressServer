import { config } from "dotenv";
import { GridFSBucket, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import fs from "fs";
config();
// Replace the placeholder with your Atlas connection string
const uri: string = process.env["DB_URI"]!;
const dbName: string = process.env["DB_NAME"]!;
export interface fileprops {
  _id: ObjectId;
  filename: string;
  uploadDate: string;
  filesize: string;
}
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

export const deleteFileHandler = async (filename: string) => {
  try {
    const db = client.db(dbName);
    const fileDetails = await db
      .collection("fileUpload.files")
      .findOne({ filename: filename });
    await db
      .collection("fileUpload.files")
      .findOneAndDelete({ filename: filename });
    await db
      .collection("fileUpload.chunks")
      .deleteMany({ files_id: fileDetails?._id });
  } catch (error) {
    console.error("Error deleting file and chunks:", error);
  }
};

export const getAllFilesHandler = async () => {
  try {
    const db = client.db(dbName);
    // const allFilesChunks = await db.collection("fileUpload.chunks")

    const allFilesData = await db
      .collection("fileUpload.files")
      .find({})
      .toArray();
    if (!allFilesData || allFilesData.length === 0) {
      throw new Error("No files found");
    }
    // Prepare an array to store the file objects
    const fileObjects: fileprops[] = [];
    for (const file of allFilesData) {
      let eachFile: fileprops = {
        _id: file["_id"],
        filename: file["filename"],
        uploadDate: file["uploadDate"],
        //content: bucket.openDownloadStreamByName(file["filename"]),
        filesize: file["length"],
      };

      // const chunks = await allFilesChunks
      //   .find({ files_id: eachFile._id })
      //   .toArray();
      // const chunksData = [];
      // for await (const chunk of chunks) {
      //   chunksData.push(chunk["data"].buffer);
      // }
      // const fileObject = Buffer.concat(chunksData);
      // // // Add the file content to the fileObject
      //eachFile = { ...eachFile, content: bucket.openDownloadStreamByName(file["filename"]) };

      fileObjects.push(eachFile);
    }
    return fileObjects.length ? fileObjects : [0];
  } catch (error) {
    return [error];
  }
};

export const singleFileHandler = async (filename: string) => {
  try {
    const db = client.db(dbName);
    // const allFilesChunks = await db.collection("fileUpload.chunks");

    const bucket = new GridFSBucket(db, { bucketName: "fileUpload" });
    return bucket.openDownloadStreamByName(filename);
  } catch (err) {
    return err;
  }
};
