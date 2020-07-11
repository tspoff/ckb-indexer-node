// tslint:disable-next-line: no-var-requires
const loki = require("lokijs");

const DbCollections = {
    DAOS: 'daos',
    PROPOSALS: 'proposals',
    SIGNATURES: 'signatures'
}

const db = new loki('db');
const daos = db.addCollection('daos', { indices: ['daoId'] });
const proposals = db.addCollection('proposals', { indices: ['proposalId', 'daoId'] });
const signatures = db.addCollection('signatures', { indices: ['proposalId', 'daoId', 'voterId'] });
let proposalCount = 0n;

db.clearDatabase = () => {
    proposals.clear();
    proposalCount = 0n;
}

db.addProposal = (proposal, txSkeleton) => {
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

db.addSignatures = (proposalId, sigsToAdd) => {
    /* TODO: ADd validation to signatures
        - Ensure correct user signed this request
        - Ensure not a duplicate
    */
    const proposal = proposals.findOne({ proposalId });
    proposal.signatures = sigsToAdd;
    proposals.update(proposal);
    return proposals.findOne({ proposalId });
}

export {
    db,
    DbCollections
}