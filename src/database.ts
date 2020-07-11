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

db.clearDatabase = () => {
    daos.clear();
    proposals.clear();
    signatures.clear();
}

db.addProposal = (proposal, txSkeleton) => {
    proposals.insert({
        ...proposal,
        txSkeleton
    })
}

db.addSignatures = (proposalId, sigsToAdd) => {
    /* TODO: Add validation to signatures
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