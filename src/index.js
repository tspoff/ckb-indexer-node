require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { indexer, collectCells, collectTransactions } = require("./indexer");
const { common, secp256k1Blake160, helper } = require("@ckb-lumos/common-scripts");
const {generateAddress, parseAddress, createTransactionFromSkeleton,
  sealTransaction, TransactionSkeleton } = require("@ckb-lumos/helpers");
  const { initializeConfig, getConfig } = require("@ckb-lumos/config-manager");
  const {knownTxTypes, buildSkeletonByType, secp256k1Blake160Transfer} = require('./txGenerator');
const {proposals, signatures, addProposal, addTransaction, addSignatures, clearDatabase} = require('./database');

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

initializeConfig();

app.post("/get-cells", (req, res) => {
  console.log('request', req.body); // your JSON
  const cells = collectCells(req.body).then((cells) => {
    return res.json(JSON.stringify(cells));
  });
});

app.post("/get-transactions", (req, res) => {
  const transactions = collectTransactions().then((cells) => {
    return res.json(JSON.stringify(transactions));
  });
});

app.post("/get-proposals", (req, res) => {
  const {daoId} = req.body;
  return res.json(proposals.find({ daoId}));
});

app.post("/clear-database", (req, res) => {
  clearDatabase();
  return res.json({error: 'none'});
});

app.post("/add-proposal", async (req, res) => {
  console.log('/add-proposal', req.body);
  const {sender, proposal, txFee} = req.body;

  try {
    const txSkeleton = await secp256k1Blake160Transfer(indexer, {
      sender,
      recipient: proposal.recipientAddress,
      amount: proposal.amount,
      txFee
    });
    const proposalId = addProposal(proposal, txSkeleton);
    return res.json({proposalId, proposal, txSkeleton});
  } catch (error) {
    return res.json({error: error.message});
  }
});

app.post("/add-signatures", (req, res) => {
  console.log('/add-signatures', req.body);
  const {proposalId, signatures} = req.body;
  const proposal = addSignatures(proposalId, signatures);
  return res.json({proposalId, proposal});
});

app.post("/build-tx", async (req, res) => {
  console.log('/build-transfer-ckb-tx', req.body);
  const {txType, params} = req.body;

  try {
    const txSkeleton = buildSkeletonByType(txType, params);
    const transactionId = addTransaction(txSkeleton);
    return res.json({transactionId, txSkeleton});
  } catch (error) {
    return res.json({error});
  }
});

app.listen(process.env.PORT, () => {
  console.log(`ckb-indexer-node listening on port ${process.env.PORT}!`),
    indexer.startForever();
});
