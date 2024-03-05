const PongScoreboardTest = artifacts.require("PongScoreboardTest");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

contract("PongScoreboardTest", function (/* accounts */) {
  it("should assert true", async function () {
    await PongScoreboardTest.deployed();
    return assert.isTrue(true);
  });
});
