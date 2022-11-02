const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet(); ``
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);
const { NODE } = require('../config')
const axios = require('axios');
const {response} = require('express');

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
  const transaction = wallet.createTransaction(recipient, cpu, ram, disk, bc, tp);
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


app.post('/info/add', (req, res) => {

  

  // const data = req.body
  // let datas = new Data(req.body)
  // let date_ob = new Date()
  // datas.TIME = date_ob
  // console.log(` Data : ${req.body}`);
  // console.log(` Data : ${req.body['CPU']}`);
  // // console.log()
  // // console.log(` Data : ${data}`);
  // // console.log(`${data[0]}`)
  // sendInfo(datas)
  // res.json({ datas })
})
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

  let url = `${NODE}/info/get`
  axios.get(url)
    .then(response => {
      data = response.data
      console.log(response.data);
      const publicKey = wallet.publicKey;
      let tran = {
        recipient: publicKey,
        cpu: data.CPU,
        ram: data.RAM,
        disk: data.SSD
      }
    
      const { recipient, cpu, ram, disk } = tran
      const transaction = wallet.createTransaction(recipient, cpu, ram, disk, bc, tp)
      p2pServer.broadcastTransaction(transaction);
    })
    .catch(error => {
      // console.log(error);

    });
    
}

setInterval(checkNewTrans, 2000);
setInterval(sendInfo, 10000);
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();