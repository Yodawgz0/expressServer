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

export const fetchPlayerByName = async (playerName) => {
  await client
    .connect()
    .then()
    .catch(() => {
      return false;
    });
  const db = client.db(dbName);
  const namedPlayers = await db
    .collection("playerData")
    .find({ PLAYER_NAME: playerName });
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
    {
      $sort: {
        names: 1,
      },
    },
  ]);
  return namedPlayers.toArray();
};
