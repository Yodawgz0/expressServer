import express, { Request, Response } from "express";
import {
  LoginUser,
  RegisterUser,
  getUserDetails,
} from "../services/credentialsUser.ts";
import { userLogin, userRegProps } from "../models/IUser.ts";
import {
  AccessTokenVerify,
  generateAccessToken,
} from "../middlewares/tokenProcess.ts";
import { serialize } from "cookie";
import { config } from "dotenv";
import { createClient } from "redis";
import jwt from "jsonwebtoken";

const router = express.Router();
router.use(express.json());

config();

const uri: string = process.env["REDIS_DB_URL"]!;
const password: string = process.env["REDIS_PASSWORD"]!;
const port: string = process.env["REDIS_PORT"]!;

const cookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 60 * 60 * 1000), // 7 days
  path: "/",
};

const client = createClient({
  password: password,
  socket: {
    host: uri,
    port: parseInt(port),
  },
});

router.post("/login", async (_req: Request, res: Response) => {
  const userDetails: userLogin = {
    email: _req.body.userDetails.email,
    password: _req.body.userDetails.password,
  };
  const result = await LoginUser(userDetails);
  if (result === "user notfound") {
    res.status(404).json({
      message: "User Not Found",
    });
  } else if (result === "login successful") {
    res.clearCookie("jwtToken");
    const token = await generateAccessToken(_req.body.userDetails.email);
    const cookie = serialize("jwtToken", token, cookieOptions);
    res.setHeader("Set-Cookie", cookie).status(200).json({
      message: "Login Successful",
    });
    console.log(cookie);
  } else if (result === "wrong password")
    res.status(401).json({
      message: "Wrong Password",
    });
});

router.post("/register", (_req: Request, res: Response) => {
  const userDetails: userRegProps = {
    email: _req.body.userDetails.email,
    firstName: _req.body.userDetails.firstname,
    lastName: _req.body.userDetails.lastname,
    password: _req.body.userDetails.password,
  };
  RegisterUser(userDetails).then((response: boolean) => {
    res.status(response ? 201 : 500).json({
      message: response
        ? "User Registered Successfully"
        : "Something Went Wrong",
    });
  });
});

router.get(
  "/getUsername",
  AccessTokenVerify,
  async (_req: Request, res: Response) => {
    const userDetails = await res.locals["userDetails"];
    const result = await getUserDetails(userDetails["email"]);
    if (result !== "user notfound") {
      res.status(200).json({ message: result });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
);

router.get("/userSignOut", (_req: Request, res: Response) => {
  res.clearCookie("jwtToken");
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "This is Ashley Express APP" });
});

export { router };
