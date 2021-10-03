const SHA256 = require('crypto-js/sha256')


class Transaction {
    constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    }
}

class Block {
    constructor(timeStamp, transactions, previousHash ) {
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    
    calculateHash() {
        return SHA256(this.previousHash + this.timeStamp +
            JSON.stringify(this.transactions) + this.nonce).toString();
    }
    
    mineBlock(difficulty) {
    
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
        console.log("Nonce: " + this.nonce);
       
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 6;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    
    createGenesisBlock() {
        return new Block("01/01/2021", "Genesis Block", "0");
    }
    
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    minePendingTransactions(miningRewardAddress) {
        this.pendingTransactions.push(new Transaction(null, miningRewardAddress, this.miningReward));
        let block = new Block(Date.now(), this.pendingTransactions,this.getLastBlock().hash);
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        this.chain.push(block);
        this.pendingTransactions=[];
            
    
    }
    
    createTransaction(trans) {
    this.pendingTransactions.push(trans);
    }
    
    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
let pycoin = new Blockchain();
pycoin.createTransaction(new Transaction('address1', 'address2', 100));
pycoin.createTransaction(new Transaction('address2', 'address3', 50));
console.log("miner-1 balance is", pycoin.getBalanceOfAddress('miner1-address'));
console.log("miner-2 balance is", pycoin.getBalanceOfAddress('miner2-address'));
console.log("\nStarting the  Miner-1...");
pycoin.minePendingTransactions('miner1-address');

pycoin.createTransaction(new Transaction('address3', 'address1', 20));
pycoin.createTransaction(new Transaction('address3', 'address2', 20));
pycoin.createTransaction(new Transaction('address2', 'address3', 5));
console.log("\nStarting the Miner-2...");
pycoin.minePendingTransactions('miner2-address');


console.log("A1's balance is", pycoin.getBalanceOfAddress('address1'));
console.log("A2's balance is", pycoin.getBalanceOfAddress('address2'));
console.log("A3's balance is", pycoin.getBalanceOfAddress('address3'));
console.log("miner-1's balance is", pycoin.getBalanceOfAddress('miner1-address'));
console.log("miner-2's balance is", pycoin.getBalanceOfAddress('miner1-address'));

console.log(pycoin.chain);
