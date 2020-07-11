import {
  Indexer,
  CellCollector,
  TransactionCollector,
} from "@ckb-lumos/indexer";

export const indexer = new Indexer("http://127.0.0.1:8114", "/tmp/indexed-data");

export async function collectCells(params) {
  const collector = new CellCollector(indexer, params);

  const cells = [];
  for await (const cell of collector.collect()) {
    cells.push(cell);
  }

  return cells;
}

export async function collectTransactions(params) {
  const txCollector = new TransactionCollector(indexer, params);

  const txs = [];
  for await (const tx of txCollector.collect()) {
    txs.push(tx);
  }

  return txs;
}