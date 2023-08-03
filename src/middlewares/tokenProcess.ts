import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

config();

export async function generateAccessToken(username: string) {
  return jwt.sign({ email: username }, process.env["JWT_TOKEN"]!, {
    expiresIn: "2h",
  });
}

export const AccessTokenVerify = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["jwtToken"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
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
