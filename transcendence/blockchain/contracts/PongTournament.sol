// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PongTournament {
    // Define a structure to hold Tournament information
    struct Tournament {
        uint256 id;
        string  tournamentName;
        string  winnerName;
    }

    // Map an address to a Tournament
    mapping(address => Tournament) private tournament;

    // Event that will be emitted whenever a Tournament's updated
    event TournamentUpdated(address indexed Tournament, uint256 indexed id, string tournamentName, string winnerName);

    // Function to update a Tournament's info
    function updateResult(uint256 id, string memory tournamentName, string memory winnerName) public {
        tournament[msg.sender].id = id;
        tournament[msg.sender].tournamentName = tournamentName;
        tournament[msg.sender].winnerName = winnerName;

        // Emit the ScoreUpdated event
        emit TournamentUpdated(msg.sender, id, tournamentName, winnerName);
    }

    // Function to retrieve a Tournament's info
    function getTournamentInfo(address tournamentAddress) public view returns (uint256, string memory, string memory) {
        // Return the tournament's info, mapping returns 0 if Tournament doesn't exist
        if (tournament[tournamentAddress].id != 0) {
            uint id = tournament[tournamentAddress].id;
            string memory name = tournament[tournamentAddress].tournamentName;
            string memory winner = tournament[tournamentAddress].winnerName;
            return (id, name, winner);
        }
        else
             revert("Tournament does not exist");
    }
}
