require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketIo = require("socket.io");

const { sealTransaction } = require("@ckb-lumos/helpers");
const { initializeConfig } = require("@ckb-lumos/config-manager");
initializeConfig();
const { indexer, collectCells, collectTransactions } = require("./indexer");
const { secp256k1Blake160Transfer } = require("./txGenerator");
const {
  proposals,
  addProposal,
  addSignatures,
  clearDatabase,
} = require("./database");
const { RPC } = require("ckb-js-toolkit");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const rpc = new RPC("http://127.0.0.1:8114");

const SocketEvents = {
  ADD_PROPOSAL: "addProposal",
  ADD_SIGNATURES: "addSignatures",
};

app.post("/get-cells", (req, res) => {
  console.log("request", req.body); // your JSON
  collectCells(req.body).then((cells) => {
    return res.json(JSON.stringify(cells));
  });
});

app.post("/get-transactions", (req, res) => {
  collectTransactions(req.body).then((transactions) => {
    return res.json(JSON.stringify(transactions));
  });
});

app.post("/get-proposals", (req, res) => {
  const { daoId } = req.body;
  return res.json(proposals.find({ daoId }));
});

app.post("/clear-database", (req, res) => {
  clearDatabase();
  return res.json({ error: "none" });
});

app.post("/add-proposal", async (req, res) => {
  console.log("/add-proposal");
  const { sender, proposal, txFee } = req.body;

  try {
    const txSkeleton = await secp256k1Blake160Transfer(indexer, {
      sender,
      recipient: proposal.recipientAddress,
      amount: proposal.amount,
      txFee,
    });

    const proposalId = addProposal(proposal, txSkeleton);
    io.emit(SocketEvents.ADD_PROPOSAL, { proposalId, proposal, txSkeleton });

    return res.json({ status: "success" });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});

app.post("/add-signatures", (req, res) => {
  console.log("/add-signatures");
  try {
    const { proposalId, signatures } = req.body;

    const proposal = addSignatures(proposalId, signatures);
    io.emit(SocketEvents.ADD_SIGNATURES, { proposalId, proposal, signatures });

    return res.json({ status: "success" });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});

// TODO: Make clients subscribe to a given set of dao IDs rather than all
io.on("connection", (socket) => {
  socket.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  socket.emit("something");
});

app.post("/send-proposal", async (req, res) => {

  try {
    const { proposalId } = req.body;
    const proposal = proposals.findOne({ proposalId });

    console.log("/send-proposal", {
      proposalId,
      txSkeleton: proposal.txSkeleton,
    });

    const tx = sealTransaction(proposal.txSkeleton, proposal.signatures);

    const txHash = await rpc.send_transaction(tx);
    return res.json({ txHash, tx });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

server.listen(process.env.PORT, () => {
  console.log(`ckb-indexer-node listening on port ${process.env.PORT}`),
    indexer.startForever();
});
