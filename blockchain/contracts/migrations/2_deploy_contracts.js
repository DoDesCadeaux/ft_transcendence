const PongScoreboard = artifacts.require("PongScoreboard");

module.exports = async function (deployer) {
    // Deploy the contract
    deployer.deploy(PongScoreboard);

     // Access the deployment transaction receipt
    const deploymentTx = await MyContract.deployed().transactionHash;

    // Log the transaction receipt to the console
    console.log('Deployment transaction receipt:', deploymentTx);

    // Retrieve the contract address from the receipt
    const contractAddress = deploymentTx.contractAddress;
    console.log('Contract address:', contractAddress);
};

