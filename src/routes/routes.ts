import express, { Request, Response } from "express";
import { RegisterUser } from "../services/credentialsUser.ts";
import { userRegProps } from "../services/IUser.ts";

const router = express.Router();
router.use(express.json());
router.post("/login", (_req: Request, res: Response) => {
  console.log(_req.body.values);
  res.status(200).json({ works: 7 });
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
    res
      .status(response ? 200 : 500)
      .json({
        message: response
          ? "User registered successfully"
          : "something went wrong",
      });
  });
});

export { router };
