import express, { Request, Response } from "express";
import {
  fetchDistinctPlayersName,
  fetchPlayerByFilter,
} from "../services/filterPlayerData.ts";
import { AccessTokenVerify } from "../middlewares/tokenProcess.ts";

const filterPlayer = express.Router();

filterPlayer.get(
  "/playerDataFilter/PLAYERNAME:playername?&SHOTMADE:shotmade?",
  async (_req: Request, res: Response) => {
    if (
      _req.params["playername"]?.substring(1) ||
      _req.params["shotmade"]?.substring(1)
    ) {
      const namedPlayers = await fetchPlayerByFilter(
        _req.params["playername"]?.substring(1) || "",
        _req.params["shotmade"]?.substring(1) || ""
      );
      res.send({ data: namedPlayers }).status(200);
    } else {
      res
        .send({ message: "ERROR: Filter shotmade or filtername missing" })
        .sendStatus(400);
    }
  }
);

filterPlayer.get(
  "/playerDataFilter/getplayernames",
  AccessTokenVerify,
  async (_req: Request, res: Response) => {
    const allPlayersDistinctName = await fetchDistinctPlayersName();
    res.send({ data: allPlayersDistinctName }).status(200);
  }
);

export { filterPlayer };
