import { indexer } from "./indexer";
import { sampleProposals } from "./sampleData";
import { DbCollections } from "./database";
import { buildSecp256k1Blake160Transfer } from "./txGenerators";

export async function loadDAOs(daos, db) {
  console.log(daos);
  for (const dao of daos) {
    const dbDaos = db.getCollection(DbCollections.DAOS);

    dbDaos.insert({
      daoId: dao.id,
      lockScript: dao.lockScript,
      voterCount: dao.voterCount,
      votingThreshold: dao.votingThreshold,
    });
  }
}

export async function loadProposals(daoIds, db) {
  // Find all on-chain passed proposals (transactions for multisig);
  // Find all off-chain proposals + metadata for on-chain proposals

  for (const proposal of sampleProposals) {
    const txSkeleton = buildSecp256k1Blake160Transfer(indexer, {
      sender: proposal.senderAddress,
      recipient: proposal.recipientAddress,
      amount: proposal.amount,
      txFee: proposal.txFee
    })

    db.addProposal(proposal, txSkeleton);
  }
}
