import express, { Request, Response } from "express";

const router = express.Router();
router.use(express.json());
router.post("/login", (_req: Request, res: Response) => {
  console.log(_req.body.values);
  res.status(200).json({ works: 7 });
});

export { router };
