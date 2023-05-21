import { MongoClient, ServerApiVersion } from "mongodb";
import { userRegProps } from "./IUser.ts";
import { config } from "dotenv";
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

export async function RegisterUser({
  email,
  firstName,
  lastName,
  password,
}: userRegProps) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
    const db = client.db("playerRecords");
    const collection = db.collection("users");
    const doc = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    };
    const result = await collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
