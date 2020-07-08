const loki = require("lokijs");

const db = new loki('db');
const transactions = db.addCollection('transactions', { indices: ['hash'] });
const proposals = db.addCollection('proposals', { indices: ['proposalId', 'daoId'] });
let proposalCount = 0n;

const addTransaction = (skeleton) => {
    const transactionId = ckbHash(JSON.stringify(txSkeleton))
    transactions.insert({ transactionId, skeleton });
    console.log(db.serialize());
    return transactionId;
}

const clearDatabase = () => {
    proposals.clear();
    proposalCount = 0n;
}

const addProposal = (proposal, txSkeleton) => {
    const id = proposalCount.toString();
    console.log(proposal);

    proposals.insert({
        proposalId: id,
        ...proposal,
        txSkeleton
    })

    proposalCount = proposalCount + 1n;
    return id;
}

const addSignatures = (proposalId, signatures) => {
    const proposal = proposals.findOne({ proposalId });
    proposal.signatures = signatures;
    proposals.update(proposal);
    return proposals.findOne({ proposalId });
}

module.exports = {
    db,
    proposals,
    addTransaction,
    addProposal,
    addSignatures,
    clearDatabase
}
