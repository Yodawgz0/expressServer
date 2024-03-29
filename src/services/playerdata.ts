import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";
import { playerprops } from "../models/IPlayerData.ts";
import { ObjectId } from "bson";
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
    await client
      .connect()
      .then()
      .catch(() => {
        return false;
      });
    const db = client.db(dbName);
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
    return result;
  }
}

export async function getAllPlayerRecord() {
  await client
    .connect()
    .then()
    .catch(() => {
      return false;
    });
  const db = client.db(dbName);
  const allPlayerData = db
    .collection("playerData")
    .find({})
    .toArray()
    .then((data) => {
      return data;
    });
  return allPlayerData;
}

export async function deletePlayer(ID: ObjectId) {
  await client.connect();
  const db = client.db(dbName);
  const deletedData = db.collection("playerData").deleteOne({
    _id: ID,
  });
  return deletedData;
}

export async function editOnePlayer(ID: ObjectId, dataEdited: playerprops) {
  await client
    .connect()
    .then()
    .catch(() => {
      return false;
    });
  const db = client.db(dbName);
  const updatedData = await db
    .collection("playerData")
    .updateOne({ _id: ID }, { $set: dataEdited });
  console.log(updatedData);
  return updatedData;
}
