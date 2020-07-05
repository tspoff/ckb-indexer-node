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
  params = {
    lock: {
      code_hash:
        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      hash_type: "type",
      args: "0x27fe447b532a2cc8282aa655dec3077b7e5d83a0",
    },
  };

  const collector = new CellCollector(indexer, params);

  const cells = [];
  for await (const cell of collector.collect()) {
    cells.push(cell);
    console.log(cell);
  }

  return cells;
}

async function collectTransactions(params) {
  const txCollector = new TransactionCollector(indexer, params);

  const txs = [];
  for await (const tx of txCollector.collect()) {
    txs.push(tx);
    console.log(tx);
  }

  return txs;
}

module.exports =  {
    indexer,
    collectCells,
    collectTransactions
}