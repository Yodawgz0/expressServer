import express, { Request, Response } from "express";
import {
  AddPlayerData,
  deletePlayer,
  getAllPlayerRecord,
} from "../services/playerdata.ts";
import { ObjectId } from "bson";

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

playerData.delete(
  "/deletePlayerData/:cd&:pn&:id",
  async (_req: Request, res: Response) => {
    if (_req.params["cd"] && _req.params["pn"] && _req.params["id"]) {
      await deletePlayer(new ObjectId(_req.params["id"]))
        .then(() => {
          res
            .status(202)
            .json({ message: _req.params["pn"] + " Data is Deleted" });
        })
        .catch((err) => console.log(err));
    } else {
      res
        .status(400)
        .json({ message: "Not Enough Information to delete player" });
    }
  }
);

export { playerData };
