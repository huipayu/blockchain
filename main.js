//importamos la libreria cripto para hashear
const SHA256 = require('crypto-js/sha256');

//Creación del bloque
class Block {
    constructor(index, data, previousHash = ''){
        //posiciones en la blockchain
        this.index = index;
        //fecha de la blockchain
        this.date = new Date();
        //información que se añade en el bloque
        this.data = data;
        //Hash del bloque previo
        this.previousHash = previousHash;
        //Hash del bloque actual
        this.hash = this.createHash();
        //Creamos una variable que cumpla la condición de hashing que determinará la dificultad de minado
        this.nonce = 0;
    }

    //Realizamos el Hash sobre el bloque usando el índice(posicion), fecha y la información del bloque
    createHash(){
        return SHA256(this.index + this.date + this.data + this.previoushHash + this.nonce).toString();
    }

    mine(difficulty){
        while(!this.hash.startsWith(difficulty)){
            this.nonce++;
            this.hash = this.createHash();
        }
    }
}


class BlockChain{
    //Crea el primer bloque de la blockchain
    constructor(genesis, difficulty = '00'){
        this.chain = [this.createFirstBlock(genesis)];
        this.difficulty = difficulty;
    }
    //Devuelve el primer elemento de la cadena 
    createFirstBlock(genesis){
        return new Block(0, genesis);
    }
    //Devuelve el último elemento de la cadena
    getLastBlock(){
        return this.chain[this.chain.length-1];
    }
    //Añadimos un nuevo bloque a la cadena
    addBlock(data){
        //Recogemos la información del último bloque de la cadena
        let prevBlock = this.getLastBlock();
        //creamos un nuevo bloque incrementando el indice(contador), pasandole la información del nuevo bloque y el hash para que se almacene
        let block = new Block(prevBlock.index+1, data, prevBlock.hash);
        block.mine(this.difficulty);
        console.log('Minado!'+block.hash+'con nonce'+block.nonce);
        //Añadimos en la cadena el bloque
        this.chain.push(block);
    }
    //validamos el bloque
    isValid(){
        //Empezamos por 1 ya que la información del bloque genesis lo damos por correcto
        for(let i=1; i<this.chain.length; i++){
            let prevBlock= this.chain[i-1];
            let currBlock = this.chain[i];
            //comprobamos si el hash es el mismo que el bloque anterior
            if(currBlock.previousHash != prevBlock.hash){
                return false;
            }
            //comprobamos que el hash actual es el mismo que el que se crea
            if(currBlock.createHash() != currBlock.hash){
                return false;
            }
            return true;
        }
    }
}

//block = new Block(0, 'test');
//console.log(JSON.stringify(block,null,2));

//Creamos la criptomoneda en la blockchain
let HuvaCoin = new BlockChain('informacion de genesis','000');
//Añadimos bloques a la cadena
HuvaCoin.addBlock('Huihong es el mejor');
HuvaCoin.addBlock('El blockchain es lo mejor');
//Mostrar en consola la blockchain
//console.log(JSON.stringify(HuvaCoin,null,2));

console.log(HuvaCoin.isValid());
//Alteramos el data del bloque de la posición 1 (bloque del medio ya que el primero es el genesis y
//el último no esta conectada a un bloque siguiente
HuvaCoin.chain[1].data = 'fake data in order to invalidate the blockchain';
//Comprobamos si la blockchain es valida o no
console.log(HuvaCoin.isValid());
