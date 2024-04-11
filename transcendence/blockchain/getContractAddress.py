from web3 import Web3
import json

print("STARTING")

# Connect to Ganache
w3 = Web3(Web3.HTTPProvider("http://ganache:8545"))

# Get the latest block
latest_block = w3.eth.get_block('latest')

# Get the transaction from the latest block
transaction = w3.eth.get_transaction(latest_block['transactions'][0])


# Get the contract address from the transaction receipt
receipt = w3.eth.get_transaction_receipt(transaction['hash'])
contract_address = receipt['contractAddress']

# Write the contract address to a file
with open('/transcendence/blockchain/tempContractAddress.txt', 'w') as file:
    file.write(contract_address.strip())
    
print("FINISHED")