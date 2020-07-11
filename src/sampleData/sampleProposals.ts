// Test proposals
export const sampleProposals = [
  {
    daoId: "0",
    amount: BigInt(90000000000).toString(),
    txFee: BigInt(10000000).toString(),
    senderAddress: "ckt1qyqz0ljy0dfj5txg9q42v4w7cvrhkljaswsq9lywju",
    recipientAddress: "ckt1qyq93ytst2ax2j9z53utjq0srnndxw5cd3sqer8pkt",
    metadata: {
      title: "Marketing Proposal",
      body:
        "Erin is requesting compensation for Milestone one of <marketing proposal>",
    },
    signatures: [],
    tags: ["#funding"],
    txSkeleton: {},
  },
  {
    daoId: "0",
    amount: BigInt(80000000000).toString(),
    txFee: BigInt(10000000).toString(),
    senderAddress: "ckt1qyqz0ljy0dfj5txg9q42v4w7cvrhkljaswsq9lywju",
    recipientAddress: "ckt1qyq93ytst2ax2j9z53utjq0srnndxw5cd3sqer8pkt",
    metadata: {
      title: "Development Proposal",
      body:
        "Alice is requesting compensation for Milestone one of <development proposal>",
    },
    signatures: [],
    tags: ["#funding"],
    txSkeleton: {},
  },
];
