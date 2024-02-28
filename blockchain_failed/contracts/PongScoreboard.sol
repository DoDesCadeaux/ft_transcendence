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
