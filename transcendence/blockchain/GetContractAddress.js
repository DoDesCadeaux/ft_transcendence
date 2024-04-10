const { execSync } = require('child_process');
const fs = require('fs');

try {
    // Run the truffle migrate command and capture the output
    const output = execSync('npx truffle migrate --network development', { encoding: 'utf8' });

    // Parse the output to find the contract address
    const match = output.match(/Contract created: (.*)\n/);
    const contractAddress = match && match[1];

    // Write the contract address to a file
    fs.writeFileSync('./blockchain/tempContractAddress.txt', contractAddress);
} catch (error) {
    console.error('Error running truffle migrate:', error);
}

// const fs = require('fs');
// const { execSync } = require("child_process");

// function getAddress() {
//   const output = execSync("npx truffle migrate --reset --network development");
//   const contractAddress = output
//   .toString()
//   .split("contract address:")[1]
//   .trim()
//   .split("\n")[0];

//   fs.writeFileSync("tempContractAddress.txt", contractAddress);
//   console.log(`Contract address written to tempContractAddress.txt: ${contractAddress}`);
// }

// getAddress();