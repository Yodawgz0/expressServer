import { router } from "./src/routes/userLoginReg.ts";
import express from "express";
import cors from "cors";
import { playerData } from "./src/routes/playerDataRoute.ts";
import cookies from "cookie-parser";
import { uploadFile } from "./src/routes/fileUploadRoute.ts";
import { filterPlayer } from "./src/routes/playerInfoRoute.ts";
import serverless from "serverless-http";

const app = express();
app.use(cookies());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(router);
app.use(playerData);
app.use(uploadFile);
app.use(filterPlayer);

app.listen(8000, () => {
  console.log("Listening on 8000");
});

export const handler = serverless(app);
