import { MongoClient, ServerApiVersion } from "mongodb";
import { userLogin, userRegProps } from "../models/IUser.ts";
import { config } from "dotenv";
config(); 
const uri: string = process.env["DB_URI"]!;
const dbName: string = process.env["DB_NAME"]!;

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
    const db = client.db(dbName);
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

export const getUserDetails = async (email: string) => {
  await client
    .connect()
    .then()
    .catch(() => {
      return false;
    });
  let result: string = "";
  try {
    const db = client.db(dbName);
    const collection = db.collection("users");
    const document = await collection.findOne({
      email: email,
    });
    if (document !== null) {
      result = `${document["firstName"]} ${document["lastName"]}`;
    } else {
      result = "user notfound";
    }
  } finally {
    await client.close();
    return result;
  }
};

export async function LoginUser({ email, password }: userLogin) {
  await client
    .connect()
    .then()
    .catch(() => {
      return false;
    });
  let result: string = "";
  try {
    const db = client.db(dbName);
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
