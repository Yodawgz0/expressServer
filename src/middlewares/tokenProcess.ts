import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "redis";

config();
const uri: string = process.env["REDIS_DB_URL"]!;
const password: string = process.env["REDIS_PASSWORD"]!;
const port: string = process.env["REDIS_PORT"]!;

const client = createClient({
  password: password,
  socket: {
    host: uri,
    port: parseInt(port),
  },
});

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

export async function generateAccessToken(username: string) {
  await client
    .connect()
    .then(() => {})
    .catch((err) => console.log(err));
  const jwtToken = jwt.sign({ email: username }, process.env["JWT_TOKEN"]!, {
    expiresIn: "2h",
  });
  client
    .set(
      username,
      JSON.stringify({
        jwtToken: jwtToken,
        loggedIn: new Date().toLocaleString(),
      })
    )
    .then()
    .catch((err) => console.log(err));

  return jwtToken;
}

export const AccessTokenVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["jwtToken"];
  const userDetails = await res.locals["userDetails"];
  const emailToRemove = userDetails["email"];

  await redis_client
    .connect()
    .then(async () => {
      await redis_client.del(emailToRemove);
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong!" });
      console.error("Error connecting to Redis:", err);
    });
  if (!token) {
    return res
      .clearCookie("jwtToken")
      .status(401)
      .json({ message: "Unauthorized" });
  }
  // Verify the token
  jwt.verify(
    token,
    process.env["JWT_TOKEN"]!,
    (err: any, decodedToken: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.locals["userDetails"] = decodedToken;
      // Token is valid, extract the user information if needed
      return next();
    }
  );
  return;
};
