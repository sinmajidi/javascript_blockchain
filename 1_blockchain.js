const SHA256 = require('crypto-js/sha256');
class Block {
    constructor(index, timeStamp, data, previousHash = '') {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timeStamp +
            JSON.stringify(this.data)).toString();
       
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
       
    }
    createGenesisBlock() {
        return new Block(0, "01/01/2019", "Genesis Block", "0");
       
    }
    getLastestBlock() {
        return this.chain[this.chain.length - 1];
      
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLastestBlock().hash;
    
        newBlock.hash = newBlock.calculateHash();
    
        this.chain.push(newBlock);
        
        }
   
}

let pycoin = new Blockchain();
pycoin.addBlock(new Block(1, "10/07/2021", {amount: 4}));
pycoin.addBlock(new Block(2, "12/07/2021", {amount: 10}));
console.log(JSON.stringify(pycoin, null, 4));