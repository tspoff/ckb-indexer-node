import express from "express";
import { db } from "../database";

const routes = express.Router();

routes.post("/clear-database", (req: any, res) => {
  try {
    db.clearDatabase();
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ error: "error!" });
  }
});

export default routes;