import { router } from "./src/routes/userLoginReg.ts";
import express from "express";
import cors from "cors";
import { playerData } from "./src/routes/playerDataRoute.ts";
const app = express();

app.use(cors());
app.use(router);
app.use(playerData);

app.listen(8000, () => {
  console.log("Listening on 8000");
});
