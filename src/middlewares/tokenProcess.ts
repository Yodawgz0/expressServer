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

export async function generateAccessToken(username: string) {
  await client.connect();
  const jwtToken = jwt.sign({ email: username }, process.env["JWT_TOKEN"]!, {
    expiresIn: "3h",
  });
  client.set("jwtToken", jwtToken);
  return jwtToken;
}

export const AccessTokenVerify = (
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
