import dotenv from "dotenv";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import socketIo from "socket.io";

import { initializeConfig } from "@ckb-lumos/config-manager";
initializeConfig();
import { indexer } from "./indexer";
import { db } from "./database";
import { loadDAOs, loadProposals } from "./daoLoader";
import { sampleDAOs } from "./sampleData";
import { daoRoutes, adminRoutes, indexerRoutes } from "./routes";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use((req: any, res, next) => {
  req.io = io;
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/dao", daoRoutes);
app.use("/indexer", indexerRoutes);
app.use("/admin", adminRoutes);

const server = http.createServer(app);
const io = socketIo(server);

const trackedDAOs = ["0"];

// TODO: Make clients subscribe to a given set of dao IDs rather than all
io.on("connection", (socket) => {
  socket.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  socket.emit("something");
});

function print (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    const match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []))

server.listen(process.env.PORT, () => {
  console.log(`ckb-indexer-node listening on port ${process.env.PORT}`),
  indexer.startForever();
  loadDAOs(sampleDAOs, db);
  loadProposals(trackedDAOs, db);
});
