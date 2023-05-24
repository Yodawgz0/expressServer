import express, { Request, Response } from "express";
import { AddPlayerData, getAllPlayerRecord } from "../services/playerdata.ts";

const playerData = express.Router();
playerData.use(express.json());

playerData.post("/playerData", async (_req: Request, res: Response) => {
  AddPlayerData(_req.body.userDetails)
    .then((response) => {
      console.log(response);
      res.status(201).json({ message: "Player Data is created successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something Went Wrong" });
    });
});
playerData.get("/AllPlayerData", async (_req: Request, res: Response) => {
  const allPlayerData = await getAllPlayerRecord();
  res.status(200).json({ data: allPlayerData });
});

export { playerData };
