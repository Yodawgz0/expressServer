import express, { Request, Response } from "express";

const filterPlayer = express.Router();

filterPlayer.get("/playerDataFilter", async (_req: Request, res: Response) => {
  res.sendStatus(200);
});

export { filterPlayer };
