const { common, secp256k1Blake160, helper } = require("@ckb-lumos/common-scripts");
const {generateAddress, parseAddress, createTransactionFromSkeleton,
  sealTransaction, TransactionSkeleton } = require("@ckb-lumos/helpers");

const secp256k1Blake160Transfer = async (indexer, params) => {
    const {sender, recipient, amount, txFee} = params;

    let txSkeleton = TransactionSkeleton({ cellProvider: indexer });

    txSkeleton = await secp256k1Blake160.transfer(txSkeleton, sender, recipient, BigInt(amount));
    txSkeleton = await secp256k1Blake160.payFee(txSkeleton, sender, txFee);
    txSkeleton = secp256k1Blake160.prepareSigningEntries(txSkeleton);
    return txSkeleton;
}

const knownTxFunctions = {
    'secp256k1Blake160Transfer': secp256k1Blake160Transfer
}

const buildSkeletonByType = async (txType, params) => {
    const fnName = Object.keys(knownTxFunctions).find(key => {
        console.log(key, txType);
        return key === 'secp256k1Blake160Transfer';
    });

    console.log(fnName, knownTxFunctions[fnName]);
    console.log(await knownTxFunctions[fnName](params));

    if (!!fnName) {
        return await knownTxFunctions[fnName](params);
    } else {
        throw new Error('Unknown TX type');
    }
}

module.exports = {
    buildSkeletonByType,
    secp256k1Blake160Transfer,
    knownTxTypes: knownTxFunctions
}