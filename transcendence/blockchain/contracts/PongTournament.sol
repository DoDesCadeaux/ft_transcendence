// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PongTournament {
    // Structure that holds Tournament information
    struct Tournament {
        string tournamentName;
        string winnerUsername;
        string p1Username;
        string p1Nickname;
        string p2Username;
        string p2Nickname;
        string p3Username;
        string p3Nickname;
        string p4Username;
        string p4Nickname;
        bool   exists;
    }

    // Map tournament IDs to their respective Tournament
    mapping(uint256 => Tournament) private tournaments;

    // Event that will be emitted whenever a Tournament's updated
    event TournamentUpdated(uint256 indexed id, string tournamentName, string winnerUsername, string p1Username, string p1Nickname, string p2Username, string p2Nickname, string p3Username, string p3Nickname, string p4Username, string p4Nickname);

    // Function to update a Tournament's info
    function updateResult(uint256 id, string memory tournamentName, string memory winnerUsername, string memory p1Username, string memory p1Nickname, string memory p2Username, string memory p2Nickname, string memory p3Username, string memory p3Nickname, string memory p4Username, string memory p4Nickname)  public {
        tournaments[id].tournamentName = tournamentName;
        tournaments[id].winnerUsername = winnerUsername;
        tournaments[id].p1Username = p1Username;
        tournaments[id].p1Nickname = p1Nickname;
        tournaments[id].p2Username = p2Username;
        tournaments[id].p2Nickname = p2Nickname;
        tournaments[id].p3Username = p3Username;
        tournaments[id].p3Nickname = p3Nickname;
        tournaments[id].p4Username = p4Username;
        tournaments[id].p4Nickname = p4Nickname;
        tournaments[id].exists = true;

        emit TournamentUpdated(id, tournamentName, winnerUsername, p1Username, p1Nickname, p2Username, p2Nickname, p3Username, p3Nickname, p4Username, p4Nickname);
    }

    // Function to retrieve a Tournament's info
    function getTournamentResult(uint256 id) public view returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        Tournament memory t = tournaments[id];
        require(tournaments[id].exists, "Tournament does not exist");
        return (t.tournamentName, t.winnerUsername, t.p1Username, t.p1Nickname, t.p2Username, t.p2Nickname, t.p3Username, t.p3Nickname, t.p4Username, t.p4Nickname);
    }

    // Function to check if a Tournament exists
    function tournamentExists(uint256 id) public view returns (bool) {
        return tournaments[id].exists;
    }
}
