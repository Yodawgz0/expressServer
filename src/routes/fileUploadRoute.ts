import express, { Request, Response } from "express";
import {
  deleteFileHandler,
  uploadFileHandler,
} from "../middlewares/fileupload.ts";
import multer from "multer";
import { AccessTokenVerify } from "../middlewares/tokenProcess.ts";
const uploadFile = express.Router();
uploadFile.use(express.json());

const upload = multer({ dest: "uploads/" });

uploadFile.post(
  "/uploadfile",
  AccessTokenVerify,
  upload.single("file"),
  async (_req: Request, res: Response) => {
    const file = _req.file;
    if (file) {
      try {
        const result = await uploadFileHandler(file!); // Pass the file to the handler function
        res.status(200).json({ message: result });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    } else {
      res.status(400).json({ message: "File Not Found!" });
    }
  }
);

uploadFile.delete(
  "/deleteFile/:id",
  AccessTokenVerify,
  async (_req: Request, res: Response) => {
    const filename = _req.params["id"];
    console.log(filename);
    if (filename) {
      try {
        const result = await deleteFileHandler(filename!); // Pass the file to the handler function
        res.status(200).json({ message: result });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    } else {
      res.status(400).json({ message: "ID not found!" });
    }
  }
);

export { uploadFile };
