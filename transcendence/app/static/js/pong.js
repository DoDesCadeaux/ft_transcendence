// var winner = scoreLeft > scoreRight ? data.player1.username : data.player2.username

let canvas, ctx, ballX, ballY, paddleLeftY, paddleRightY, ia;

// get canvas & context
function setAsyncVariables(dataMatch) {
  canvas = document.getElementById("pongCanvas");
  ctx = canvas.getContext("2d");
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  paddleLeftY = canvas.height / 2 - paddleHeight / 2;
  paddleRightY = canvas.height / 2 - paddleHeight / 2;
  data = dataMatch;
  ia = data.player2.username == "IA" ? true : false;
}

// Set up initial vars
const paddleWidth = 10,
  paddleHeight = 80,
  ballSize = 10,
  ballSpeed = 4,
  pointsToScore = 5; // Remettre à 5
let ballSpeedX = Math.sin(ballSpeed) * ballSpeed;
let ballSpeedY = Math.cos(ballSpeed) * ballSpeed;
let startGame = 1,
  ballInPlay = false,
  scoreLeft = 0,
  scoreRight = 0,
  victoriesR = 0,
  victoriesL = 0,
  totalScoreR = 0,
  totalScoreL = 0;
let data, startTime, endTime;
let gamePaused = false;

// Set up initial vars
let countdownInProgress = false;
const padding = 10;

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
  if (event.key === " " && gamePaused) gamePaused = 0;
});

let aiPaddleSpeed = 10; // Vitesse de la raquette de l'IA
let futureBallY;

function predictBallPosition() {
  if (ballSpeedX > 0) {
    futureBallY =
      ballY +
      ballSpeedY *
        ((canvas.width - ballSize - padding - paddleWidth - ballX) /
          ballSpeedX);
  }
}

function aiPlayer() {
  if (futureBallY < 0 || futureBallY > canvas.height) {
    // Si la balle va rebondir sur le haut ou le bas du canvas, inverser la direction de l'IA
    if (paddleRightY > 0) {
      paddleRightY -= aiPaddleSpeed;
    }
  } else {
    // Sinon, continuer à suivre la balle normalement
    if (futureBallY < paddleRightY) {
      if (paddleRightY > 0) {
        paddleRightY -= aiPaddleSpeed;
      }
    } else if (futureBallY > paddleRightY + paddleHeight) {
      if (paddleRightY < canvas.height - paddleHeight) {
        paddleRightY += aiPaddleSpeed;
      }
    }
  }
}

let aiUpdateCounter = 0;

// Main loop
function gameLoop() {
  if (gamePaused) {
    setTimeout(gameLoop, 1000 / 120);
    return;
  }
  if (startGame % 2 != 0) {
    countdownInProgress = true;
    countdown(3);
  }
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
  if (!ia) {
    if (keysPressed["ArrowUp"]) if (paddleRightY > 0) paddleRightY -= 10;
    if (keysPressed["ArrowDown"])
      if (paddleRightY < canvas.height - paddleHeight) paddleRightY += 10;
  } else {
    if (aiUpdateCounter++ >= 60) {
      predictBallPosition();
      aiUpdateCounter = 0;
    }
    aiPlayer();
  }

  if (ballInPlay) {
    move();
    draw();
  }

  setTimeout(gameLoop, 1000 / 100); // Appel de gameLoop() environ toutes les 8.33 ms (120 FPS)
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
  if (
    ballX < paddleWidth + ballSize + padding &&
    ballY > paddleLeftY &&
    ballY < paddleLeftY + paddleHeight
  ) {
    // Calculate the relative position of the ball on the paddle
    let relativeIntersectY = ballY - (paddleLeftY + paddleHeight / 2);
    let normalizedRelativeIntersectionY =
      relativeIntersectY / (paddleHeight / 2);
    normalize(normalizedRelativeIntersectionY);

    // Calculate the bounce angle
    let bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4);

    // Adjust ball speed based on the bounce angle
    let direction = ballX + ballSize < canvas.width / 2 ? 1 : -1;
    ballSpeedX = Math.cos(bounceAngle) * ballSpeed;
    ballSpeedY = Math.sin(bounceAngle) * ballSpeed;
    ballX = paddleWidth + ballSize + padding;

    ballSpeedY *= 1.05;
    ballSpeedX *= 1.05;
  }
  //Right
  if (
    ballX > canvas.width - paddleWidth - ballSize - padding &&
    ballY > paddleRightY &&
    ballY < paddleRightY + paddleHeight
  ) {
    // Calculate the relative position of the ball on the paddle
    let relativeIntersectY = ballY - (paddleRightY + paddleHeight / 2);
    let normalizedRelativeIntersectionY =
      relativeIntersectY / (paddleHeight / 2);
    normalize(normalizedRelativeIntersectionY);

    // Calculate the bounce angle
    let bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4);

    // Adjust ball speed based on the bounce angle
    let direction = ballX + ballSize < canvas.width / 2 ? 1 : -1;
    ballSpeedX = -Math.cos(bounceAngle) * ballSpeed;
    ballSpeedY = Math.sin(bounceAngle) * ballSpeed;
    ballX = canvas.width - paddleWidth - ballSize - padding;
    ballSpeedY *= 1.1;
    ballSpeedX *= 1.1;
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
  ctx.fillRect(
    canvas.width - paddleWidth - padding,
    paddleRightY,
    paddleWidth,
    paddleHeight
  );

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
  if (ctx) {
    ctx.font = "30px Roboto";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      "La partie commence dans :",
      canvas.width / 2,
      canvas.height / 2
    );
  }

  let interval = setInterval(function () {
    // Display the remaining time
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Roboto";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(seconds + " secondes", canvas.width / 2, canvas.height / 2);

    seconds--;

    // Checks if the countdown is finished
    if (seconds < 0) {
      clearInterval(interval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = "30px Roboto";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(
        "Appuyez sur espace pour commencer la partie",
        canvas.width / 2,
        canvas.height / 2
      );

      countdownInProgress = false;
    }
  }, 1000);

  startGame++;
}

// Terminer le jeu
function endGame() {
  ballInPlay = false;
  stopTimer();
  const formData = new FormData();
  formData.append("id", data.match_id);
  formData.append("player1_score", scoreLeft);
  formData.append("player2_score", scoreRight);
  formData.append("match_duration", getGameDuration());

  fetch(`/api/match/finish/`, {
    method: "POST",
    body: formData,
    headers: {
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Erreur lors la mise a jour du match :", error);
    });

  // Afficher le score final et proposer de relancer la partie
  winner =
    scoreLeft > scoreRight ? data.player1.username : data.player2.username;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Roboto";
  ctx.fillStyle = "#f78a50";
  ctx.textAlign = "center";
  ctx.fillText(`${winner} a gagne`, canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText(
    `${scoreLeft} - ${scoreRight}`,
    canvas.width / 2 - 1,
    canvas.height / 2 + 10
  );

  setTimeout(function () {
    window.location.href = "/";
  }, 3000);
  document.removeEventListener("keydown", keyboardEvent);
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
  ballSpeedX = -ballSpeedX;
}

function normalize(normalizedRelativeIntersectionY) {
  if (normalizedRelativeIntersectionY == 0)
    normalizedRelativeIntersectionY += 0.001;
  if (normalizedRelativeIntersectionY == 1)
    normalizedRelativeIntersectionY -= 0.001;
  if (normalizedRelativeIntersectionY == -1)
    normalizedRelativeIntersectionY += 0.001;

  normalizedRelativeIntersectionY = Math.max(
    -1,
    Math.min(1, normalizedRelativeIntersectionY)
  );

  return normalizedRelativeIntersectionY;
}
