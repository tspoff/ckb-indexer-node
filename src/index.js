require('dotenv').config()
const express = require('express');
const { indexer, collectCells, collectTransactions } = require('./indexer');

const app = express();
 
app.get('/get-cells', (req, res) => {
  const cells = collectCells.then(cells => {
    return res.json(JSON.stringify(cells));
  })
});
 
app.get('/get-transactions', (req, res) => {
  const transactions = collectTransactions.then(cells => {
    return res.json(JSON.stringify(transactions));
  })
});

app.listen(process.env.PORT, () =>
  {
    console.log(`ckb-indexer-node listening on port ${process.env.PORT}!`),
      indexer.startForever();
      collectCells({});
  }
);