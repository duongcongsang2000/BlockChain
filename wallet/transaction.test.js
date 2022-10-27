const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

describe('Transaction', () => {
  let transaction, wallet, recipient, cpu;

  beforeEach(() => {
    wallet = new Wallet();
    cpu = 50;
    recipient = 'r3c1p13nt';
    transaction = Transaction.newTransaction(wallet, recipient, cpu);
  });

  it('outputs the `cpu` subtracted from the wallet balance', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).cpu)
      .toEqual(wallet.balance - cpu);
  });

  it('outputs the `cpu` added to the recipient', () => {
    expect(transaction.outputs.find(output => output.address === recipient).cpu)
      .toEqual(cpu);
  });

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.cpu).toEqual(wallet.balance);
  });

  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].cpu = 50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe('transacting with an cpu that exceeds the balance', () => {
    beforeEach(() => {
      cpu = 50000;
      transaction = Transaction.newTransaction(wallet, recipient, cpu);
    });

    it('does not create the transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });

  describe('and updating a transaction', () => {
    let nextAmount, nextRecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = 'n3xt-4ddr355';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it(`subtracts the next cpu from the sender's output`, () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).cpu)
        .toEqual(wallet.balance - cpu - nextAmount);
    });

    it('outputs an cpu for the next recipient', () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).cpu)
        .toEqual(nextAmount);
    });
  });

  describe('creating a reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    });

    it(`reward the miner's wallet`, () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).cpu)
        .toEqual(MINING_REWARD);
    });
  });
});