const PongScoreboard = artifacts.require("PongScoreboard");

module.exports = async function (deployer) {
    // Deploy the contract
    const pongScoreboardInstance = await deployer.deploy(PongScoreboard);

    // Access the deployment transaction receipt
    const deploymentTx = pongScoreboardInstance.transactionHash;

    // Log the transaction receipt to the console
    console.log('Deployment transaction receipt:', deploymentTx);

    // Retrieve the contract address from the receipt
    const contractAddress = pongScoreboardInstance.address;
    console.log('Contract address:', contractAddress);
};
