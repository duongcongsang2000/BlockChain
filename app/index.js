const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

var dataRoute = require('../routes/data.route');
var mongoose = require('mongoose')
const cors = require('cors');
mongoose.connect('mongodb://localhost:27017/express-demo')
const HTTP_PORT1 = process.env.HTTP_PORT1 || 5555;
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();``
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
  const { recipient, cpu, ram, disk } = req.body;
  const transaction = wallet.createTransaction(recipient, cpu ,ram ,disk, bc, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  // console.log(`New block added: ${block.toString()}`);
  res.redirect('/blocks');
});

app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

// app.get('/start', (req, res) => {
//   const publicKey = wallet.publicKey;
//   let tran = {
//     recipient: publicKey,
//     cpu: 30,
//     ram: 40,
//     disk: 50
//   }
//   const transaction = wallet.createTransaction(recipient, cpu ,ram ,disk, bc, tp);
//   p2pServer.broadcastTransaction(transaction);

// });

function checkNewTrans() {
  if (tp.transactions.length !== 0) {
    let temp = tp.transactions;
    if (temp[0].input.address !== wallet.publicKey) {
      const block = miner.mine();
      // console.log(`New block added: ${block.toString()}`);
    console.log('New block added ');
    }
  }
}

function sendInfo() {
  const publicKey = wallet.publicKey;
  let tran = {
    recipient: publicKey,
    cpu: 30,
    ram: 40,
    disk: 50
  }
  
  const { recipient, cpu, ram, disk } = tran
  const transaction = wallet.createTransaction(recipient, cpu ,ram ,disk, bc, tp)
  p2pServer.broadcastTransaction(transaction);
}

setInterval(checkNewTrans, 3000);
setInterval(sendInfo, 10000);


app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();



app.use(express.json()) // for parsing application/json
  // app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use('/data', dataRoute);  
app.listen(HTTP_PORT1, function() {
console.log('server listening on port ' + HTTP_PORT1);
});