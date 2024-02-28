const MyContract = artifacts.require('PongScoreboard');

contract('PongScoreboard', (accounts) => {
  it('should deploy MyContract', async () => {
    const myContractInstance = await MyContract.deployed();
    assert(myContractInstance.address !== '', 'Contract address should not be empty');
  });

  it('should set and get a value', async () => {
    const myContractInstance = await MyContract.deployed();

    // Set a value
    await myContractInstance.setValue(42, { from: accounts[0] });

    // Get the value
    const value = await myContractInstance.getValue();

    // Verify that the value was set correctly
    assert.equal(value, 42, 'Value should be 42');
  });
});
