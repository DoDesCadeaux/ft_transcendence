async function interactWithContract(web3, contract, score) {
    try {
      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0];
      const tx = await contract.methods.setScore(score).send({ from: sender });
      console.log('Transaction hash:', tx.transactionHash);
    } catch (error) {
      console.error('Error interacting with contract:', error);
    }
  }
  
  module.exports = interactWithContract;