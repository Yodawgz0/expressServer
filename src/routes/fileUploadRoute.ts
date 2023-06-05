import express, { Request, Response } from "express";
import { uploadFileHandler } from "../middlewares/fileupload.ts";
const uploadFile = express.Router();
uploadFile.use(express.json());

uploadFile.get(
  "/uploadfile",

  async (_req: Request, res: Response) => {
    await uploadFileHandler()
      .then((data) => res.status(200).json({ message: data }))
      .catch((err) => res.status(500).json({ message: err }));
  }
);

export { uploadFile };
