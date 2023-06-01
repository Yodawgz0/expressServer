import express, { Request, Response } from "express";
import { LoginUser, RegisterUser } from "../services/credentialsUser.ts";
import { userLogin, userRegProps } from "../services/IUser.ts";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

function generateAccessToken(username: string) {
  return jwt.sign({ email: username }, process.env["JWT_TOKEN"]!, {
    expiresIn: "1h",
  });
}

const router = express.Router();
router.use(express.json());

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
    const token = generateAccessToken(_req.body.userDetails.email);
    res.status(200).json({
      message: "Login Successful",
      token: token,
      payload: { email: _req.body.userDetails.email },
    });
  } else if (result === "wrong password")
    res.status(401).json({
      message: "Wrong Password",
    });
});

router.post("/register", (_req: Request, res: Response) => {
  console.log(_req.body);
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

export { router };
