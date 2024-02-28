const PongScoreboard = artifacts.require("PongScoreboard");

module.exports = function(deployer) {
    // Command Truffle to deploy the Smart Contract
    deployer.deploy(PongScoreboard);
  };