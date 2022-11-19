const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
};
let opened = [], connected = [];
class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    process.on("uncaughtException", err => console.log(err));
    const server = new Websocket.Server({ port: P2P_PORT });
    try {
      server.on("connection", async (socket, req) => { 
        socket = this.connectSocket(socket);
       
        console.log('Socket Lang nghe');
      });
      this.connectToPeers();
      // server.on('error', ()=>{
      //   console.log('Server Error Close ');
      // });
      // socket.on('disconnect',()=>{
      //   console.log('Disconect connect close');
      // });
      console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    } catch  {
      // // server.off('ECONNRESET');
      // console.log("Reconnect !!")
      // setTimeout(this.connectToPeers(), 5000);
      // console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }
  }
  connectToPeers() {
      peers.forEach(peer => {
        const socket = new Websocket(peer);
        socket.on("open", () => {
          this.connectSocket(socket);
        })
        socket.on("close", () => {
          console.log('socket close');
          this.sockets.splice(this.sockets.indexOf(socket),1);
          this.peers.splice(peers.indexOf(peer),1); 
        });
        // socket.on('error',()=> {
        //   console.log('Socket connect error');
        // });
        // socket.on('disconnect',()=>{
        //   console.log('Socket connect close');
        // });
      console.log('connected '+ connected);
    })
  }

  connectSocket(socket) {
    try {
      this.sockets.push(socket);
      console.log('length socket '+ this.sockets.length);
      console.log('Socket connected');
      this.messageHandler(socket);
      this.sendChain(socket);
    } catch (error) {
      console.log("connectSocket error:", error)
    }
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      switch(data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction
    }));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction) {
    // console.log('length sockets hien tai '+ this.sockets.length);
    this.updatesockets();
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
  updatesockets(){
    console.log('Update Socket Auto');
    this.sockets.forEach(socket => {
      if (socket.readyState==2) this.sockets.splice(this.sockets.indexOf(socket),1);
      console.log('length sockets update '+ this.sockets.length);
    })
  }
  broadcastClearTransactions() {
    this.updatesockets();
    this.sockets.forEach(socket => socket.send(JSON.stringify({
      type: MESSAGE_TYPES.clear_transactions
    })));
  }
}

module.exports = P2pServer;