// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract PongTournament {
//     // Define a structure to hold Tournament information
//     struct Tournament {
//         uint256 id;
//         string  tournamentName;
//         string  winnerName;
//     }

//     // Map an address to a Tournament
//     mapping(address => Tournament) private tournament;

//     // Event that will be emitted whenever a Tournament's updated
//     event TournamentUpdated(address indexed Tournament, uint256 indexed id, string tournamentName, string winnerName);

//     // Function to update a Tournament's info
//     function updateResult(uint256 id, string memory tournamentName, string memory winnerName) public {
//         tournament[msg.sender].id = id;
//         tournament[msg.sender].tournamentName = tournamentName;
//         tournament[msg.sender].winnerName = winnerName;

//         // Emit the ScoreUpdated event
//         emit TournamentUpdated(msg.sender, id, tournamentName, winnerName);
//     }

//     // Function to retrieve a Tournament's info
//     function getTournamentResult(address tournamentAddress) public view returns (uint256, string memory, string memory) {
//         // Return the tournament's info, mapping returns 0 if Tournament doesn't exist
//         if (tournament[tournamentAddress].id != 0) {
//             uint id = tournament[tournamentAddress].id;
//             string memory name = tournament[tournamentAddress].tournamentName;
//             string memory winner = tournament[tournamentAddress].winnerName;
//             return (id, name, winner);
//         }
//         else
//              revert("Tournament does not exist");
//     }
// }

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
