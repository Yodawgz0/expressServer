import { router } from "./src/routes/userLoginReg.ts";
import express from "express";
import cors from "cors";
import { playerData } from "./src/routes/playerDataRoute.ts";
import cookies from "cookie-parser";
const app = express();
app.use(cookies());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(router);
app.use(playerData);

app.listen(8000, () => {
  console.log("Listening on 8000");
});
