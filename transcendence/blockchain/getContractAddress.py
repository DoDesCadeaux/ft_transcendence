from web3 import Web3
import json

try:
    w3 = Web3(Web3.HTTPProvider("http://ganache:8545"))

    latest_block_number = w3.eth.block_number
    latest_block = w3.eth.get_block(latest_block_number)

    if 'transactions' in latest_block and latest_block['transactions']:
        transaction = w3.eth.get_transaction(latest_block['transactions'][0])

        # Get the contract address from the transaction receipt
        receipt = w3.eth.getTransactionReceipt(transaction['hash'])
        contract_address = receipt['contractAddress']

        # Write the contract address to a file
        with open('/transcendence/blockchain/tempContractAddress.txt', 'w') as file:
            file.write(contract_address.strip())
    else:
        print("No transactions found in the latest block.")
except Exception as e:
    print("An error occurred while running getContractAddress.py:", e)
