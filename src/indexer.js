const {
  Indexer,
  CellCollector,
  TransactionCollector,
} = require("@ckb-lumos/indexer");

const indexer = new Indexer(
  "http://127.0.0.1:8114",
  "/tmp/indexed-data"
);

async function collectCells(params) {

  const collector = new CellCollector(indexer, params);

  const cells = [];
  for await (const cell of collector.collect()) {
    cells.push(cell);
  }

  return cells;
}

async function collectTransactions(params) {
  const txCollector = new TransactionCollector(indexer, params);

  const txs = [];
  for await (const tx of txCollector.collect()) {
    txs.push(tx);
  }

  return txs;
}

module.exports =  {
    indexer,
    collectCells,
    collectTransactions
}