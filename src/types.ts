import { MultisigScript } from "@ckb-lumos/common-scripts";

export interface DAOProposalSignature {
  proposalId: string;
  daoId: string;
  voterId: string;
  signature: string;
}

export enum SocketEvents {
  ADD_PROPOSAL = "addProposal",
  UPDATE_PROPOSAL = "updateProposal",
}

export enum TxStatus {
  NOT_SENT,
  PENDING,
  COMPLETE,
}

export interface DAOProposal {
  daoId: string;
  amount: string;
  txFee: string;
  senderAddress: string;
  recipientAddress: string;
  metadata: {
    title: string;
    body: string;
  };
  signatures: string[];
  tags: string[];
  txSkeleton: any;
  txHash: null | string;
  txStatus: TxStatus;
}

export interface DAO {
  id: string;
  script: MultisigScript;
}
