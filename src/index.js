require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { indexer, collectCells, collectTransactions } = require("./indexer");
const { common, secp256k1Blake160, helper } = require("@ckb-lumos/common-scripts");
const {generateAddress, parseAddress, createTransactionFromSkeleton,
  sealTransaction, TransactionSkeleton } = require("@ckb-lumos/helpers");
  const { initializeConfig, getConfig } = require("@ckb-lumos/config-manager");

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

app.post("/build-transfer-ckb-tx", async (req, res) => {
  console.log('/build-transfer-ckb-tx', req.body);
  const {sender, recipient, amount, txFee} = req.body;

  let txSkeleton = TransactionSkeleton({ cellProvider: indexer });

  txSkeleton = await secp256k1Blake160.transfer(txSkeleton, sender, recipient, BigInt(amount));
  // console.log(JSON.stringify(createTransactionFromSkeleton(txSkeleton), null, 2));

  txSkeleton = await secp256k1Blake160.payFee(txSkeleton, sender, txFee);
  console.log(JSON.stringify(createTransactionFromSkeleton(txSkeleton), null, 2));

  txSkeleton = secp256k1Blake160.prepareSigningEntries(txSkeleton);
  console.log(txSkeleton.get("signingEntries").toArray());
  return res.json(JSON.stringify(txSkeleton));
});

app.listen(process.env.PORT, () => {
  console.log(`ckb-indexer-node listening on port ${process.env.PORT}!`),
    indexer.startForever();
});
