const PongTournament = artifacts.require("PongTournament");

module.exports = function(deployer) {
    // Command Truffle to deploy the Smart Contract
    deployer.deploy(PongTournament).then(() => {
      console.log("PongTournament deployed");
      PongTournament.deployed().then((instance) => {
        console.log("Contract address:", instance.address);
        execSync(`node write_contract_address.js "${instance.address}"`);
      });
    });
  };