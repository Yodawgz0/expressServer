import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";
import { playerprops } from "./IPlayerData.ts";
config();
// Replace the placeholder with your Atlas connection string
const uri: string = process.env["DB_URI"]!;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function AddPlayerData({
  GAME_ID,
  SHOT_NUMBER,
  PERIOD,
  SHOT_RESULT,
  CLOSEST_DEFENDER,
  PLAYER_NAME,
}: playerprops) {
  let result: boolean = false;
  try {
    await client.connect();
    const db = client.db("playerRecords");
    const collection = db.collection("playerData");
    const doc = {
      GAME_ID: GAME_ID,
      SHOT_NUMBER: SHOT_NUMBER,
      PERIOD: PERIOD,
      SHOT_RESULT: SHOT_RESULT,
      CLOSEST_DEFENDER: CLOSEST_DEFENDER,
      PLAYER_NAME: PLAYER_NAME,
    };
    await collection
      .insertOne(doc)
      .then(() => {
        result = true;
      })
      .catch((err) => {
        console.log(err);
      });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    return result;
  }
}
