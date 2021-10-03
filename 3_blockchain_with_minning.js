const SHA256 = require('crypto-js/sha256');
class Block {
    constructor(index, timeStamp, data, previousHash = '') {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timeStamp +
            JSON.stringify(this.data)+this.nonce).toString();
       
    }
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    } 
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
       
    }
    createGenesisBlock() {
        return new Block(0, "01/01/2019", "Genesis Block", "0");
       
    }
    getLastestBlock() {
        return this.chain[this.chain.length - 1];
      
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLastestBlock().hash;
    
        newBlock.mineBlock(this.difficulty);
    
        this.chain.push(newBlock);
        
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
console.log("Mining block 1...");
pycoin.addBlock(new Block(1, "10/07/2021", {amount: 4}));
console.log("Mining block 2...");
pycoin.addBlock(new Block(2, "12/07/2021", {amount: 33}));
console.log("Mining block 3...");
pycoin.addBlock(new Block(2, "12/07/2021", {amount: 5.5}));
//pycoin.chain[1].data = { amount : 1000 } 
//pycoin.chain[1].hash = pycoin.chain[1].calculateHash() 
console.log(JSON.stringify(pycoin, null, 4));
console.log("Is the blockchain valid? " + pycoin.isChainValid());