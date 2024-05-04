import { MongoClient, ServerApiVersion } from "mongodb";
import { userLogin, userRegProps } from "../models/IUser.ts";
import { config } from "dotenv";
import { createClient } from "redis";
config();
const uri: string = process.env["DB_URI"]!;
const dbName: string = process.env["DB_NAME"]!;

const redis_uri: string = process.env["REDIS_DB_URL"]!;
const redis_password: string = process.env["REDIS_PASSWORD"]!;
const redis_port: string = process.env["REDIS_PORT"]!;

const redis_client = createClient({
  password: redis_password,
  socket: {
    host: redis_uri,
    port: parseInt(redis_port),
  },
});

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
    return result;
  }
}

export const getUserDetails = async (email: string) => {
  let result: string = "";
  try {
    await client
      .connect()
      .then()
      .catch((err) => {
        console.log("Client Already Connected", err);
      });

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
        await redis_client
          .connect()
          .then(async () => {
            const keyExists = await redis_client.exists("onlineUsers");

            if (keyExists) {
              await redis_client.append("onlineUsers", `,${email}`);
            } else {
              await redis_client.set("onlineUsers", email);
            }
          })
          .catch((err: Error) => console.log(err.message));
      } else {
        result = "wrong password";
      }
    } else {
      result = "user notfound";
    }
  } finally {
    return result;
  }
}
