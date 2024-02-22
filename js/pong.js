// get canvas & context
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Set up initial vars
const pointsToScore = 2;
const ballSpeed = 5;
let round = 1; // Be careful, var used to display the coutdown & count rounnds --> round 1&2 = 1; round 2&3 = 2; ...
let ballInPlay = false;
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 10;
let paddleLeftY = canvas.height / 2 - paddleHeight / 2;
let paddleRightY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = ballSpeed;
let ballSpeedY = ballSpeed;
let scoreLeft = 0;
let scoreRight = 0;

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
    if (event.key === " ") {
        if (!ballInPlay) {
            // Relancer la partie
			// round++;
            resetGame();
        }
    }
});

// Main loop
function gameLoop() {
    if ((round % 2) != 0) {
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
    if (ballY < ballSize || ballY > canvas.height - ballSize)
        ballSpeedY = -ballSpeedY;

    // Ball collision with paddles (Left & Right)
    if (ballX < paddleWidth + ballSize && ballY > paddleLeftY && ballY < paddleLeftY + paddleHeight)
        ballSpeedX = -ballSpeedX;
    if (ballX > canvas.width - paddleWidth - ballSize && ballY > paddleRightY && ballY < paddleRightY + paddleHeight)
        ballSpeedX = -ballSpeedX;

    // Fonctionnalité du jeu : a chaque goal, la vitesse de la balle augmente de 5%
    if (ballX <= ballSize || ballX >= canvas.width - ballSize) {
        ballSpeedY *= 1.05;
        ballSpeedX *= 1.05;
        console.log("ballSpeedY = ", ballSpeedY, "ballSpeedX = ", ballSpeedX);
    }

    // Ball goes off-screen to the left or right
    if (ballX < ballSize) {
        // La balle sort à gauche, donc le joueur de droite marque un point
        scoreRight++;
        if (scoreRight == pointsToScore) {
            endGame();
        } else {
            resetBall();
        }
    } else if (ballX > canvas.width - ballSize) {
        // La balle sort à droite, donc le joueur de gauche marque un point
        scoreLeft++;
        if (scoreLeft == pointsToScore) {
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

    // Background image
    // const bgImage = new Image();
    // bgImage.src = "./background.png";
    // ctx.drawImage(bgImage, 0, 0, canvas.width, canvas. height);

    // Draw paddles
    ctx.fillStyle = "#f78a50";
    ctx.fillRect(0, paddleLeftY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight);

    // Draw line
    ctx.moveTo(canvas.width / 2, canvas.height);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.strokeStyle = "#f78a50";
    ctx.lineWidth = 5;

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

// Terminer le jeu
function endGame() {
    ballInPlay = false;
    ballSpeedX = ballSpeed;
    ballSpeedY = ballSpeed;
	paddleLeftY = canvas.height / 2 - paddleHeight / 2;
	paddleRightY = canvas.height / 2 - paddleHeight / 2;

	// Afficher le score final et proposer de relancer la partie
    var winner = scoreLeft > scoreRight ? "Dduraku" : "Tverdood"
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "30px Roboto";
    ctx.fillStyle = "#f78a50";
    ctx.textAlign = "center";
    ctx.fillText(`${winner} a gagne`, canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(`${scoreLeft} - ${scoreRight}`, canvas.width / 2 - 1, canvas.height / 2 + 10);
    ctx.fillText("Appuyez sur 'espace' pour relancer une partie", canvas.width / 2, canvas.height / 2 + 45);
}
  
function countdown(seconds) {
	ctx.font = "30px Roboto";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("La partie commence dans", canvas.width / 2, canvas.height / 2);

	let interval = setInterval(function () {
		// Display the remaining time
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = "30px Roboto";
    	ctx.fillStyle = "white";
    	ctx.textAlign = "center";
    	ctx.fillText(seconds + ' secondes', canvas.width / 2, canvas.height / 2 + 30);

		seconds--;

		// Check if the countdown is finished
		if (seconds < 0) {
			clearInterval(interval);

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.font = "30px Roboto";
    		ctx.fillStyle = "white";
    		ctx.textAlign = "center";
			ctx.fillText('Compte à rebours terminé', canvas.width / 2, canvas.height / 2);

			resetGame();
		}
	}, 1000);
	round++;
  }

function resetGame() {
	// round++;
    ballInPlay = true;
    scoreLeft = 0;
    scoreRight = 0;
    resetBall();
}

// Réinitialiser la position de la balle
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Inverser la direction de la balle
    // ballSpeedY = Math.random() > 0.5 ? -5 : 5; // Choisir une direction de balle aléatoire
}

  // Appel pour démarrer le compte à rebours
//   startGame();
  

// Appelez la fonction gameLoop() pour démarrer le jeu
// gameLoop();