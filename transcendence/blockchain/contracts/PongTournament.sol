// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PongTournament {
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
    uint256 public tournamentCount;

    // Map tournament IDs to their respective Tournament
    mapping(uint256 => Tournament) private tournaments;

    // Event that will be emitted whenever a Tournament's updated
    event TournamentCreated(uint256 indexed id, string tournamentName, string winnerUsername, string p1Username, string p1Nickname, string p2Username, string p2Nickname, string p3Username, string p3Nickname, string p4Username, string p4Nickname);

    // Function to update a Tournament's info
    function createTournament(string memory tournamentName, string memory winnerUsername, string memory p1Username, string memory p1Nickname, string memory p2Username, string memory p2Nickname, string memory p3Username, string memory p3Nickname, string memory p4Username, string memory p4Nickname)  public {
        tournaments[tournamentCount].tournamentName = tournamentName;
        tournaments[tournamentCount].winnerUsername = winnerUsername;
        tournaments[tournamentCount].p1Username = p1Username;
        tournaments[tournamentCount].p1Nickname = p1Nickname;
        tournaments[tournamentCount].p2Username = p2Username;
        tournaments[tournamentCount].p2Nickname = p2Nickname;
        tournaments[tournamentCount].p3Username = p3Username;
        tournaments[tournamentCount].p3Nickname = p3Nickname;
        tournaments[tournamentCount].p4Username = p4Username;
        tournaments[tournamentCount].p4Nickname = p4Nickname;
        tournaments[tournamentCount].exists = true;

        tournamentCount++;

        emit TournamentCreated(tournamentCount, tournamentName, winnerUsername, p1Username, p1Nickname, p2Username, p2Nickname, p3Username, p3Nickname, p4Username, p4Nickname);
    }

	function getAllTournaments() public view returns (Tournament[] memory) {
		// Create a new array to store existing tournaments
		Tournament[] memory existingTournaments = new Tournament[](tournamentCount);

		// Counter for existing tournaments
		uint256 existingTournamentsCount = 0;

		// Iterate through the tournaments mapping
		for (uint256 i = 0; i < tournamentCount; i++) {
			// Check if tournament exists
			if (tournaments[i].exists) {
				// Add tournament details to the array and increment the counter
				existingTournaments[existingTournamentsCount++] = tournaments[i];
			}
		}

		// Resize the array to the number of existing tournaments
		assembly {
			mstore(existingTournaments, existingTournamentsCount)
		}

		return existingTournaments;
	}
}