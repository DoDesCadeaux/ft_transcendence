const PongTournament = artifacts.require("PongTournament");

contract('PongTournament', function(accounts) {
  let pongTournamentInstance;
  const owner = accounts[0];
  const nonOwner = accounts[1];
  const tournamentName = "Test Tournament";
  const winnerName = "Test Winner";
  const id = 1;

  beforeEach(async function () {
    pongTournamentInstance = await PongTournament.new();
  });

  it('should update tournament result', async function () {
    await pongTournamentInstance.updateResult(id, tournamentName, winnerName, { from: owner });
    const result = await pongTournamentInstance.getTournamentResult(owner);
    assert.equal(result[0], id, "Id is not correct");
    assert.equal(result[1], tournamentName, "Tournament name is not correct");
    assert.equal(result[2], winnerName, "Winner name is not correct");
  });

  it('should retrieve tournament result', async function () {
    await pongTournamentInstance.updateResult(id, tournamentName, winnerName, { from: owner });
    const result = await pongTournamentInstance.getTournamentResult(owner);
    assert.equal(result[0], id, "Id is not correct");
    assert.equal(result[1], tournamentName, "Tournament name is not correct");
    assert.equal(result[2], winnerName, "Winner name is not correct");
  });

  it('should revert when trying to get non-existent tournament', async function () {
    try {
      await pongTournamentInstance.getTournamentResult(nonOwner);
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected revert not received");
    }
  });

  it('should emit TournamentUpdated event', async function () {
    const result = await pongTournamentInstance.updateResult(id, tournamentName, winnerName, { from: owner });
    const log = result.logs[0];
    assert.equal(log.event, "TournamentUpdated", "Event name is not correct");
    assert.equal(log.args.id.toNumber(), id, "Id is not correct");
    assert.equal(log.args.tournamentName, tournamentName, "Tournament name is not correct");
    assert.equal(log.args.winnerName, winnerName, "Winner name is not correct");
  });
});
