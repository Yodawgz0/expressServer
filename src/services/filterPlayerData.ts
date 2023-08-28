import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";
config();
// Replace the placeholder with your Atlas connection string
const uri: string = process.env["DB_URI"]!;
const dbName: string = process.env["DB_NAME"]!;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

interface IfilterPlayer {
  PLAYER_NAME?: string;
  SHOT_RESULT?: string;
  $and?: IfilterPlayer[];
}

export const fetchPlayerByFilter = async (playerName = "", shotresult = "") => {
  let query: IfilterPlayer = {};
  if (playerName && playerName.length > 0) {
    query.PLAYER_NAME = playerName;
  }
  if (shotresult && shotresult.length > 0) {
    query.SHOT_RESULT = shotresult;
  }
  if (
    playerName &&
    playerName.length > 0 &&
    shotresult &&
    shotresult.length > 0
  ) {
    query = {
      $and: [{ PLAYER_NAME: playerName }, { SHOT_RESULT: shotresult }],
    };
  }
  console.log(query);

  await client
    .connect()
    .then()
    .catch(() => {
      return false;
    });
  const db = client.db(dbName);
  const namedPlayers = await db.collection("playerData").find(query);
  return namedPlayers.toArray();
};

export const fetchDistinctPlayersName = async () => {
  await client
    .connect()
    .then()
    .catch(() => {
      return false;
    });
  const db = client.db(dbName);
  const namedPlayers = await db.collection("playerData").aggregate([
    {
      $group: {
        _id: null,
        names: {
          $addToSet: "$PLAYER_NAME",
        },
      },
    },
  ]);
  return namedPlayers.toArray();
};
