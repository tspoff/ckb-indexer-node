export interface DAOProposalSignature {
  proposalId: string;
  daoId: string;
  voterId: string;
  signature: string;
}

export enum SocketEvents {
  ADD_PROPOSAL = "addProposal",
  ADD_SIGNATURES = "addSignatures",
}
