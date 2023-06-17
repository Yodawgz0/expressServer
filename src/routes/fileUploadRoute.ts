import express, { Request, Response } from "express";
import { uploadFileHandler } from "../middlewares/fileupload.ts";
import multer from "multer";
const uploadFile = express.Router();
uploadFile.use(express.json());

const upload = multer({ dest: "uploads/" });

uploadFile.post(
  "/uploadfile",
  upload.single("file"),
  async (_req: Request, res: Response) => {
    const file = _req.file;
    try {
      const result = await uploadFileHandler(file!); // Pass the file to the handler function
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

export { uploadFile };
