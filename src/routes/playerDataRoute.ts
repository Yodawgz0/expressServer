import express, { Request, Response } from "express";
import {
  AddPlayerData,
  deletePlayer,
  editOnePlayer,
  getAllPlayerRecord,
} from "../services/playerdata.ts";
import { ObjectId } from "bson";
import { AccessTokenVerify } from "../middlewares/tokenProcess.ts";

const playerData = express.Router();
playerData.use(express.json());

playerData.post(
  "/playerData",
  AccessTokenVerify,
  async (_req: Request, res: Response) => {
    AddPlayerData(_req.body.userDetails)
      .then((_response) => {
        res
          .status(201)
          .json({ message: "Player Data is created successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong" });
      });
  }
);

playerData.get(
  "/AllPlayerData",
  AccessTokenVerify,
  async (_req: Request, res: Response) => {
    console.log(1, _req.cookies);
    await getAllPlayerRecord()
      .then((allPlayerData) => {
        res.status(200).json({ data: allPlayerData });
      })
      .catch(() => {
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
);

playerData.delete(
  "/deletePlayerData/:cd&:pn&:id",
  AccessTokenVerify,
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

playerData.patch(
  "/editPlayer/:id",
  AccessTokenVerify,
  async (_req: Request, res: Response) => {
    if (_req.params["id"]) {
      await editOnePlayer(
        new ObjectId(_req.params["id"]),
        _req.body.userDetails
      )
        .then(() => {
          res
            .status(200)
            .json({ message: "Player Data Modified Successfully" });
        })
        .catch(() => {
          res.status(304).json({ error: "Internal Server Error" });
        });
    } else {
      res.status(400).json({ error: "Not Enough Information Recvd" });
    }
  }
);

export { playerData };
