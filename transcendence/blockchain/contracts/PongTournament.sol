// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PongTournament {
    // Structure that holds Tournament information
    struct Tournament {
        string tournamentName;
        string winnerName;
    }

    // Map tournament IDs to their respective Tournament
    mapping(uint256 => Tournament) private tournaments;

    // Event that will be emitted whenever a Tournament's updated
    event TournamentUpdated(uint256 indexed id, string tournamentName, string winnerName);

    // Function to update a Tournament's info
    function updateResult(uint256 id, string memory tournamentName, string memory winnerName) public {
        tournaments[id].tournamentName = tournamentName;
        tournaments[id].winnerName = winnerName;

        emit TournamentUpdated(id, tournamentName, winnerName);
    }

    // Function to retrieve a Tournament's info
    function getTournamentResult(uint256 tournamentId) public view returns (string memory, string memory) {
        Tournament memory t = tournaments[tournamentId];
        require(bytes(t.tournamentName).length > 0, "Tournament does not exist");
        return (t.tournamentName, t.winnerName);
    }
}
