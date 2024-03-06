const PongScoreboard = artifacts.require("PongScoreboard");

contract("PongScoreboard", function (accounts) {
  let instance;
  const playerAddress = accounts[0];

  before(async function () {
    instance = await PongScoreboard.deployed();
  });

  it("should initialize the score of the deploying address to 19", async function () {
    const score = await instance.getScore(playerAddress);
    assert.equal(score, 19, "Initial score should be 19");
  });

  it("should update the score of the player", async function () {
    await instance.updateScore(42, { from: playerAddress });
    const updatedScore = await instance.getScore(playerAddress);
    assert.equal(updatedScore, 42, "Score should be updated to 42");
  });

  it("should create a new player with the provided score if player doesn't exist", async function () {
    const newPlayerAddress = accounts[1];
    await instance.updateScore(99, { from: newPlayerAddress });
    const newPlayerScore = await instance.getScore(newPlayerAddress);
    assert.equal(newPlayerScore, 99, "New player's score should be 99");
  });
});
