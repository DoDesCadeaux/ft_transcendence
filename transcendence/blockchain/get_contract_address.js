const fs = require("fs");
const { execSync } = require("child_process");

function getAddress() {
  const output = execSync("npx truffle migrate --reset --network development");
  const contractAddress = output
  .toString()
  .split("contract address:")[1]
  .trim()
  .split("\n")[0];

  fs.writeFileSync("tempContractAddress.txt", contractAddress);
  console.log(`Contract address written to tempContractAddress.txt: ${contractAddress}`);

  writeContractAddressToJs(contractAddress);
}

function writeContractAddressToJs(contractAddress) {
  fs.writeFile(
    "./ContractAddress.js",
    `${contractAddress}`,
    (err) => {
      if (err) {
        console.error("Error writing contract address to file:", err);
      } else {
        console.log("Contract address written to file successfully.");
      }
    }
  );
}

getAddress();
