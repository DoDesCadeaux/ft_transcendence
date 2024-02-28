// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract PongScoreboard {
    struct Score {
        address player;
        uint256 score;
    }

	//the 'public' keyword gives public access to the map and its content 
	//	& it automaticaly creates a getter at compilation "scores()"
    mapping(address => Score) public scores;

    event ScoreUpdated(address indexed player, uint256 score);

	//"updates score from existing player or creates a ew one if unknown"
    //external = can be called outside the contract
	//msg.sender = the caller
	//emit = trigger an event -> way for smart contracts to communicate information to external entities, 
	//							such as frontend applications or other smart contracts.
    function updateScore(uint256 newScore) external {
        scores[msg.sender].player = msg.sender;
        scores[msg.sender].score = newScore;
        emit ScoreUpdated(msg.sender, newScore);
    }

	//view --> does not modify blockchain = no gas fee
    function getScore(address player) external view returns (uint256) {
        return scores[player].score;
    }
}


// contract PongScoreboard {
//     // Define a structure to hold player information
//     struct Player {
//         uint256 score;
//         bool exists;
//     }

//     // Map an address to a Player
//     mapping(address => Player) private players;

//     // Event that will be emitted whenever a player's score is updated
//     event ScoreUpdated(address indexed player, uint256 score);

//   // Constructor to initialize the contract
//     constructor() {
//         players[msg.sender] = Player(0, true);
//     }
    
//     // Function to update a player's score
//     function updateScore(uint256 newScore) public {
//         // If the player doesn't exist yet, create them
//         if (!players[msg.sender].exists) {
//             players[msg.sender] = Player(newScore, true);
//         } else { // If the player exists, just update their score
//             players[msg.sender].score = newScore;
//         }

//         // Emit the ScoreUpdated event
//         emit ScoreUpdated(msg.sender, newScore);
//     }

//     // Function to retrieve a player's score
//     function getScore(address player) public view returns (uint256) {
//         // If the player doesn't exist, return 0
//         if (!players[player].exists) {
//             return 0;
//         }

//         // If the player exists, return their score
//         return players[player].score;
//     }
// }