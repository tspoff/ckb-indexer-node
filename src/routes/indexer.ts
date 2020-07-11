import express from "express";
import { collectCells, collectTransactions } from "../indexer";

const routes = express.Router();

routes.post("/get-cells", (req: any, res) => {
  console.log("request", req.body); // your JSON
  collectCells(req.body).then((cells) => {
    return res.json(JSON.stringify(cells));
  });
});

routes.post("/get-transactions", (req: any, res) => {
  collectTransactions(req.body).then((transactions) => {
    return res.json(JSON.stringify(transactions));
  });
});

export default routes;
