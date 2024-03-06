const PongScoreboard = artifacts.require("PongScoreboard");

module.exports = function(deployer) {
    // Command Truffle to deploy the Smart Contract
    deployer.deploy(PongScoreboard).then(() => {
      console.log("PongScoreboard deployed");
      PongScoreboard.deployed().then((instance) => {
        console.log("Contract address:", instance.address);
        execSync(`node write_contract_address.js "${instance.address}"`);
      });
    });
  };