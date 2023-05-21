import { MongoClient, ServerApiVersion } from "mongodb";
import { userLogin, userRegProps } from "./IUser.ts";
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
  let result: boolean = false;
  try {
    await client.connect();
    const db = client.db("playerRecords");
    const collection = db.collection("users");
    const doc = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
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

export async function LoginUser({ email, password }: userLogin) {
  await client.connect();
  let result: string = "";
  try {
    const db = client.db("playerRecords");
    const collection = db.collection("users");
    const document = await collection.findOne({
      email: email,
    });

    if (document !== null) {
      if (document["password"] === password) {
        result = "login successful";
      } else {
        result = "wrong password";
      }
    } else {
      result = "user notfound";
    }
  } finally {
    await client.close();
    return result;
  }
}
