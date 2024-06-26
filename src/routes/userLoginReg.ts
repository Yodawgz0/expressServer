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

const cookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 120 * 60 * 1000), // 2hrs
  path: "/",
};

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
    jwt.verify(
      token,
      process.env["JWT_TOKEN"]!,
      (_err: any, decodedToken: any) => {
        res.locals["userDetails"] = decodedToken;
      }
    );
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

router.get(
  "/userSignOut",
  AccessTokenVerify,
  async (_req: Request, res: Response) => {
    const userDetails = await res.locals["userDetails"];
    // const result = await getUserDetails(userDetails["email"]);
    await redis_client
      .connect()
      .then(async () => {
        const emailToRemove = userDetails["email"];
        await redis_client.del(emailToRemove);

        const currentValue = await redis_client.get("onlineUsers");
        if (currentValue) {
          const updatedValue = currentValue.replace(
            new RegExp(`,${emailToRemove}`, "g"),
            ""
          );
          await redis_client.set("onlineUsers", updatedValue);
          console.log(
            `Email '${emailToRemove}' removed from onlineUsers key successfully.`
          );
        } else {
          console.log("onlineUsers key does not exist.");
        }
        redis_client.quit();
        res.status(200).json({ message: "Logged out successfully" });
      })
      .catch((err: Error) => {
        console.log(err.message);
        res.status(500).json({ message: "Something went wrong!" });
        console.error("Error connecting to Redis:", err);
      });
  }
);

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "This is Ashley Express APP" });
});

export { router };
