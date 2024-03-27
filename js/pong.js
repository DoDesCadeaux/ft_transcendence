// get canvas & context
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Set up initial vars
let gamePaused = false;
let countdownInProgress = false;
const padding = 10;
const paddleWidth = 10;
const paddleHeight = 80;
let paddleLeftY = canvas.height / 2 - paddleHeight / 2;
let paddleRightY = canvas.height / 2 - paddleHeight / 2;
const ballSize = 10;
const ballSpeed = 4;
let ballSpeedX = Math.sin(ballSpeed) * ballSpeed;
let ballSpeedY = Math.cos(ballSpeed) * ballSpeed;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let startGame = 1;
let ballInPlay = false;
const pointsToScore = 5;
let scoreLeft = 0;
let scoreRight = 0;
let victoriesR = 0;
let victoriesL = 0;
let totalScoreR = 0;
let totalScoreL = 0;
let startTime;
let endTime;

function startTimer() {
    startTime = new Date();
}

function stopTimer() {
    endTime = new Date();
}

function getGameDuration() {
    return (endTime - startTime) / 1000;
}

// Variables pour stocker les états des touches
let keysPressed = {};

// Ajoutez un événement pour gérer lorsque la touche est enfoncée
document.addEventListener("keydown", function (event) {
    keysPressed[event.key] = true;
});

// Ajoutez un événement pour gérer lorsque la touche est relâchée
document.addEventListener("keyup", function (event) {
    keysPressed[event.key] = false;
});

// Ajoutez un événement pour gérer lorsque la touche Espace est enfoncée
document.addEventListener("keydown", function (event) {
    if (event.key === " " && !ballInPlay && !countdownInProgress) {
        startTimer();
        resetGame();
    }
    if (event.key === " " && gamePaused)
        gamePaused = 0;
});

// Main loop
function gameLoop() {
    if (gamePaused) {
        setTimeout(gameLoop, 1000 / 120);
        return;
    }
    if ((startGame % 2) != 0) {
        countdownInProgress = true;
		countdown(3);
	}
    // Déplacer les barres des joueurs en fonction des touches enfoncées
    if (keysPressed["w"]) {
        if (paddleLeftY > 0) {
            paddleLeftY -= 10;
        }
    }
    if (keysPressed["s"]) {
        if (paddleLeftY < canvas.height - paddleHeight) {
            paddleLeftY += 10;
        }
    }
    if (keysPressed["ArrowUp"]) {
        if (paddleRightY > 0) {
            paddleRightY -= 10;
        }
    }
    if (keysPressed["ArrowDown"]) {
        if (paddleRightY < canvas.height - paddleHeight) {
            paddleRightY += 10;
        }
    }
    if (ballInPlay) {
        move();
        draw();
    }

    setTimeout(gameLoop, 1000 / 120); // Appel de gameLoop() environ toutes les 8.33 ms (120 FPS)
}

// Rules for ball movement
function move() {
    // Ball movement (sum of pixels of actual position + nb of pixels moved)
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls 
    if (ballY <= ballSize || ballY >= canvas.height - ballSize)
        ballSpeedY = -ballSpeedY;

	// Ball collision with paddles
	// Left
	if (ballX < paddleWidth + ballSize + padding && ballY > paddleLeftY && ballY < paddleLeftY + paddleHeight) {
		// Calculate the relative position of the ball on the paddle
		let relativeIntersectY = ballY - (paddleLeftY + paddleHeight / 2);
		let normalizedRelativeIntersectionY = relativeIntersectY / (paddleHeight / 2);
		normalize(normalizedRelativeIntersectionY);

		// Calculate the bounce angle
		let bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4);

		// Adjust ball speed based on the bounce angle
		let direction = (ballX + ballSize < canvas.width/2) ? 1 : -1;
		ballSpeedX = Math.cos(bounceAngle) * ballSpeed;
		ballSpeedY = Math.sin(bounceAngle) * ballSpeed;
		ballX = paddleWidth + ballSize + padding; // Move the ball slightly away from the paddle

		ballSpeedY *= 1.05;
        ballSpeedX *= 1.05;
	}
	//Right
	if (ballX > canvas.width - paddleWidth - ballSize - padding && ballY > paddleRightY && ballY < paddleRightY + paddleHeight) {
		// Calculate the relative position of the ball on the paddle
		let relativeIntersectY = ballY - (paddleRightY + paddleHeight / 2);
		let normalizedRelativeIntersectionY = relativeIntersectY / (paddleHeight / 2);
		normalize(normalizedRelativeIntersectionY);

		// Calculate the bounce angle
		let bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4);

		// Adjust ball speed based on the bounce angle
		let direction = (ballX + ballSize < canvas.width/2) ? 1 : -1;
		ballSpeedX = -Math.cos(bounceAngle) * ballSpeed;
		ballSpeedY = Math.sin(bounceAngle) * ballSpeed;
		ballX = canvas.width - paddleWidth - ballSize - padding; // Move the ball slightly away from the paddle
		ballSpeedY *= 1.10;
        ballSpeedX *= 1.10;
	}

    // Ball goes off-screen to the left or right
    if (ballX < ballSize) {
        // La balle sort à gauche, donc le joueur de droite marque un point
        gamePaused = true;
        resetPaddles();
        scoreRight++;
        totalScoreR++;
        if (scoreRight == pointsToScore) {
            victoriesR++;
            endGame();
        } else {
            resetBall();
        }
    } else if (ballX > canvas.width - ballSize) {
        // La balle sort à droite, donc le joueur de gauche marque un point
        gamePaused = true;
        resetPaddles();
        scoreLeft++;
        totalScoreL++;
        if (scoreLeft == pointsToScore) {
            victoriesL++;
            endGame();
        } else {
            resetBall();
        }
    }
}

// Draw objects on canvas
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#f78a50";
    ctx.fillRect(padding, paddleLeftY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth - padding, paddleRightY, paddleWidth, paddleHeight);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.strokeStyle = "#f78a50";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = "#f78a50";
    ctx.fill(); //This line fills the current path

    // Affichage du score
    ctx.font = "20px Arial";
    ctx.fillStyle = "#f78a50";
    ctx.textAlign = "center";
    ctx.fillText(scoreLeft, canvas.width / 2 - 50, 30);
    ctx.fillText(scoreRight, canvas.width / 2 + 50, 30);

    if (!ballInPlay) {
        endGame();
    }
}
  
function countdown(seconds) {
    // countdownInProgress = true;
	ctx.font = "30px Roboto";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("La partie commence dans :", canvas.width / 2, canvas.height / 2);

	let interval = setInterval(function () {
		// Display the remaining time
        ctx.clearRect(canvas.width / 2 - 150, canvas.height / 2 + 5, 300, 40);

		ctx.font = "30px Roboto";
    	ctx.fillStyle = "white";
    	ctx.textAlign = "center";
    	ctx.fillText(seconds + ' secondes', canvas.width / 2, canvas.height / 2 + 30);

		seconds--;

		// Checks if the countdown is finished
		if (seconds < 0) {
			clearInterval(interval);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.font = "30px Roboto";
    		ctx.fillStyle = "white";
    		ctx.textAlign = "center";
            ctx.fillText('Appuyez sur espace pour commencer la partie.', canvas.width / 2, canvas.height / 2);

            countdownInProgress = false;

            // document.addEventListener("keydown", keyDownHandler);
		}
	}, 1000);

    startGame++;
}

// Terminer le jeu
function endGame() {
    ballInPlay = false;
    stopTimer();

	// Afficher le score final et proposer de relancer la partie
    var winner = scoreLeft > scoreRight ? "Dduraku" : "Tverdood"
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "30px Roboto";
    ctx.fillStyle = "#f78a50";
    ctx.textAlign = "center";
    ctx.fillText(`${winner} a gagne`, canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(`${scoreLeft} - ${scoreRight}`, canvas.width / 2 - 1, canvas.height / 2 + 10);

    document.removeEventListener('keydown', keyPressHandler);
    // ctx.fillText("Appuyez sur espace pour relancer une partie", canvas.width / 2, canvas.height / 2 + 45);
}

function resetGame() {
    ballInPlay = true;
    scoreLeft = 0;
    scoreRight = 0;
	resetPaddles();
    resetBall();
}

function resetPaddles() {
	paddleLeftY = canvas.height / 2 - paddleHeight / 2;
	paddleRightY = canvas.height / 2 - paddleHeight / 2;
}

// Réinitialiser la position de la balle
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Inverser la direction de la balle
    // ballSpeedY = Math.random() > 0.5 ? -5 : 5; // Choisir une direction de balle aléatoire
}

function normalize(normalizedRelativeIntersectionY) {
    if (normalizedRelativeIntersectionY == 0)
		normalizedRelativeIntersectionY += 0.001;
	if (normalizedRelativeIntersectionY == 1)
		normalizedRelativeIntersectionY -= 0.001;
	if (normalizedRelativeIntersectionY == -1)
		normalizedRelativeIntersectionY += 0.001;

	normalizedRelativeIntersectionY = Math.max(-1, Math.min(1, normalizedRelativeIntersectionY));

    return normalizedRelativeIntersectionY;
}
