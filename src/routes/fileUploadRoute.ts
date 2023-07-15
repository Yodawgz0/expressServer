import express, { Request, Response } from "express";
import {
  deleteFileHandler,
  getAllFilesHandler,
  renameFileHandler,
  singleFileHandler,
  uploadFileHandler,
} from "../middlewares/fileupload.ts";
import multer from "multer";
import { AccessTokenVerify } from "../middlewares/tokenProcess.ts";
import { ObjectId } from "bson";
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
        await deleteFileHandler(filename!); // Pass the file to the handler function
        res.status(200).json({ message: "File Deleted SuccessFully!" });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    } else {
      res.status(400).json({ message: "ID not found!" });
    }
  }
);

uploadFile.get(
  "/getUploadedFiles",
  AccessTokenVerify,
  async (_req: Request, res: Response) => {
    const fileObjects = await getAllFilesHandler();
    if (fileObjects) {
      res.status(200).json(fileObjects);
    } else if (fileObjects === 0) {
      res.status(404).json({ message: "Files Not Found!" });
    } else {
      res.status(500).json({ message: fileObjects });
    }
  }
);

uploadFile.get("/getFile/:id", async (_req: Request, res: Response) => {
  if (_req.params["id"]?.length) {
    const stream = await singleFileHandler(_req.params["id"]);
    res.set("Content-Disposition", `attachment; filename=${_req.params["id"]}`);
    //@ts-ignore
    stream.pipe(res);
  } else {
    res.status(404).json({ message: "No FileName Found!" });
  }
});
uploadFile.patch(
  "/renamefile/:id&:newname",
  async (_req: Request, res: Response) => {
    if (_req.params["id"] && _req.params["newname"]) {
      try {
        new ObjectId(_req.params["id"]);
        const result = await renameFileHandler(
          _req.params["newname"],
          new ObjectId(_req.params["id"])
        );
        console.log(result);
        res.status(200).json({ message: "File Renamed SuccessFully!" });
      } catch {
        res.status(500).json({ message: "Network Error!" });
      }
    } else {
      res.status(400).json({ message: "Need filename and file ID!" });
    }
  }
);

export { uploadFile };
