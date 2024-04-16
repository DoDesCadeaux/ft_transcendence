// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PongTournament {
    // Structure that holds Tournament information
    struct Tournament {
        string tournamentName;
        string winnerName;
        string winnerNickname;
        bool   exists;
    }

    // Map tournament IDs to their respective Tournament
    mapping(uint256 => Tournament) private tournaments;

    // Event that will be emitted whenever a Tournament's updated
    event TournamentUpdated(uint256 indexed id, string tournamentName, string winnerName, string winnerNickname);

    // Function to update a Tournament's info
    function updateResult(uint256 id, string memory tournamentName, string memory winnerName, string memory winnerNickname) public {
        tournaments[id].tournamentName = tournamentName;
        tournaments[id].winnerName = winnerName;
        tournaments[id].winnerNickname = winnerNickname;
        tournaments[id].exists = true;

        emit TournamentUpdated(id, tournamentName, winnerName, winnerNickname);
    }

    // Function to retrieve a Tournament's info
    function getTournamentResult(uint256 id) public view returns (string memory, string memory, string memory) {
        Tournament memory t = tournaments[id];
        require(tournaments[id].exists, "Tournament does not exist");
        return (t.tournamentName, t.winnerName, t.winnerNickname);
    }

    // Function to check if a Tournament exists
    function tournamentExists(uint256 id) public view returns (bool) {
        return tournaments[id].exists;
    }
}
