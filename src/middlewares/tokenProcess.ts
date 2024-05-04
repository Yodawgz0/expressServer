import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "redis";

config();

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
  await redis_client
    .connect()
    .then(() => {})
    .catch((err) => console.log(err));
  const jwtToken = jwt.sign({ email: username }, process.env["JWT_TOKEN"]!, {
    expiresIn: "2h",
  });
  redis_client
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
    async (err: any, decodedToken: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.locals["userDetails"] = decodedToken;
      // // Token is valid, extract the user information if needed
      // await redis_client
      //   .connect()
      //   .then(async () => {
      //     await redis_client.del(res.locals["userDetails"]["email"]);
      //   })
      //   .catch((err) => {
      //     res.status(500).json({ message: "Something went wrong!" });
      //     console.error("Error connecting to Redis:", err);
      //   });
      return next();
    }
  );
  return;
};
