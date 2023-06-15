import express, { Request, Response } from "express";
import { uploadFileHandler } from "../middlewares/fileupload.ts";
// import multer from "multer"
const uploadFile = express.Router();
uploadFile.use(express.json());

// const upload = multer({ dest: 'uploads/' });

uploadFile.post(
  "/uploadfile",

  async (_req: Request, res: Response) => {
    console.log(_req);
    await uploadFileHandler()
      .then((data) => res.status(200).json({ message: data }))
      .catch((err) => res.status(500).json({ message: err }));
  }
);

export { uploadFile };
