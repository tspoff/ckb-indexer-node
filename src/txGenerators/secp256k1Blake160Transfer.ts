import { secp256k1Blake160 } from "@ckb-lumos/common-scripts";
import {TransactionSkeleton } from "@ckb-lumos/helpers";

export interface TransferParams {
    sender: string,
    recipient: string,
    amount: string,
    txFee: string
}

export const buildSecp256k1Blake160Transfer = async (indexer, params: TransferParams) => {
    const {sender, recipient, amount, txFee} = params;

    let txSkeleton = TransactionSkeleton({ cellProvider: indexer });

    txSkeleton = await secp256k1Blake160.transfer(txSkeleton, sender, recipient, BigInt(amount));
    txSkeleton = await secp256k1Blake160.payFee(txSkeleton, sender, BigInt(txFee));
    txSkeleton = secp256k1Blake160.prepareSigningEntries(txSkeleton);
    return txSkeleton;
}