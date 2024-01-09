import { router } from "./src/routes/userLoginReg.ts";
import express from "express";
import cors from "cors";
import { playerData } from "./src/routes/playerDataRoute.ts";
import cookies from "cookie-parser";
import { uploadFile } from "./src/routes/fileUploadRoute.ts";
import { filterPlayer } from "./src/routes/playerIFilterRoute.ts";
import serverless from "serverless-http";
import wss from "./src/sockets/socketService.ts";
import { createServer } from "http";

export const app = express();
const server = createServer(app);
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
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
server.listen(7000, () => {
  console.log(`Listening on port ${7000}`);
});

export const handler = serverless(app);
