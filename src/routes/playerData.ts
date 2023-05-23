import express, { Request, Response } from "express";

const router = express.Router();
router.use(express.json());

router.post("/playerData", async (_req: Request, res: Response) => {
  console.log(_req.body.playerdata);
  res.status(200).json({ message: "player data recvd" });
});
