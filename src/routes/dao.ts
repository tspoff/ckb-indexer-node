import express from 'express';
import {db, DbCollections} from '../database';
import {buildSecp256k1Blake160Transfer} from '../txGenerators';
import {indexer} from '../indexer';
import { SocketEvents } from '../types';
import { sealTransaction } from "@ckb-lumos/helpers";
import rpc from '../rpc';

const routes = express.Router();

routes.post("/get-proposals", (req: any, res) => {
  const { daoId } = req.body;
  return res.json(db.getCollection(DbCollections.PROPOSALS).find({ daoId }));
});

routes.post("/add-proposal", async (req: any, res) => {
  console.log("/add-proposal");
  const { sender, proposal, txFee } = req.body;

  try {
    const txSkeleton = await buildSecp256k1Blake160Transfer(indexer, {
      sender,
      recipient: proposal.recipientAddress,
      amount: proposal.amount,
      txFee,
    });

    const proposalId = db.addProposal(proposal, txSkeleton);
    req.io.emit(SocketEvents.ADD_PROPOSAL, { proposalId, proposal, txSkeleton });

    return res.json({ status: "success" });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});

routes.post("/add-signatures", (req: any, res) => {
  console.log("/add-signatures");
  try {
    const { proposalId, signatures } = req.body;

    const proposal = db.addSignatures(proposalId, signatures);
    req.io.emit(SocketEvents.UPDATE_PROPOSAL, { proposalId, proposal, signatures });

    return res.json({ status: "success" });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});

routes.post("/send-proposal", async (req: any, res) => {
    try {
      const { proposalId } = req.body;
      const proposal = db.getCollection(DbCollections.PROPOSALS).findOne({ proposalId });

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

export default routes;