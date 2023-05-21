import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";
import { router } from "./src/routes/routes.ts";
import express from "express";
import cors from "cors";
const app = express();
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
app.use(cors());
app.use(router);

app.listen(8000, () => {
  console.log("Listening on 8000");
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
    // const db = client.db("playerRecords");
    // const collection = db.collection("records");
    // const doc = { name: "Neapolitan pizza", password: "round" };
    // const result = await collection.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
    // await collection
    //   .find({})
    //   .toArray()
    //   .then((data) => console.log(data));
    // const docDelete = {
    //   _id: {
    //     $eq: result.insertedId,
    //   },
    // };
    // const deletedOne = await collection.deleteOne(docDelete);
    // console.log(`deleted ID: ${deletedOne.deletedCount}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
