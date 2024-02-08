// get canvas & context
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Set up initial vars
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 10;
let paddleLeftY = canvas.height / 2 - paddleHeight / 2;
let paddleRightY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let firstGame = true;
let ballInPlay = false;
let scoreLeft = 0; // Score du joueur de gauche
let scoreRight = 0; // Score du joueur de droite
pointsToScore = 2;

// Variables pour stocker les états des touches
let keysPressed = {};

// Ajoutez un événement pour gérer lorsque la touche est enfoncée
document.addEventListener("keydown", function(event) {
    keysPressed[event.key] = true;
});

// Ajoutez un événement pour gérer lorsque la touche est relâchée
document.addEventListener("keyup", function(event) {
    keysPressed[event.key] = false;
});

// Ajoutez un événement pour gérer lorsque la touche Espace est enfoncée
document.addEventListener("keydown", function(event) {
    if (event.key === " ") {
        if (!ballInPlay || firstGame) {
            // Relancer la partie
            firstGame = false;
            ballInPlay = true;
            scoreLeft = 0;
            scoreRight = 0;
            resetBall();
        }
    }
});

// Main loop
function gameLoop() {
    if (firstGame == true)
        startGame();
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

    if (ballInPlay)
        move();
    draw();

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

    // Ball goes off-screen to the left or right
    if (ballX < ballSize) {
        // La balle sort à gauche, donc le joueur de droite marque un point
        scoreRight++;
        if (scoreRight >= pointsToScore) {
            endGame();
        } else {
            resetBall();
        }
    } else if (ballX > canvas.width - ballSize) {
        // La balle sort à droite, donc le joueur de gauche marque un point
        scoreLeft++;
        if (scoreLeft >= pointsToScore) {
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
    const bgImage = new Image();
    bgImage.src = "./background.png";
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas. height);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, paddleLeftY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight);

    // Draw line
    ctx.moveTo(canvas.width / 2, canvas.height);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill(); //This line fills the current path

    // Affichage du score
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(scoreLeft, canvas.width / 2 - 50, 30);
    ctx.fillText(scoreRight, canvas.width / 2 + 50, 30);

    if (!ballInPlay && !firstGame) {
        endGame();
    }
}

// Réinitialiser la position de la balle
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Inverser la direction de la balle
    ballSpeedY = Math.random() > 0.5 ? -5 : 5; // Choisir une direction de balle aléatoire
}

// Terminer le jeu
function endGame() {
    ballInPlay = false;
    // Afficher le score final et proposer de relancer la partie
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Score Final", canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(`${scoreLeft} - ${scoreRight}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText("Appuyez sur ESPACE pour relancer la partie", canvas.width / 2, canvas.height / 2 + 30);
}

// Ecran de démarage du jeu
function startGame() {
     ctx.font = "30px Arial";
     ctx.fillStyle = "white";
     ctx.textAlign = "center";
     ctx.fillText("Appuyez sur ESPACE pour lancer la partie", canvas.width / 2, canvas.height / 2 + 30);
}

// Appelez la fonction gameLoop() pour démarrer le jeu
gameLoop();