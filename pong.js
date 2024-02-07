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

// Main loop
function gameLoop() {
	move();
	draw();
}

// Rules for ball movement
function move() {
	// Ball movement (sum of pixels of actual position + nb of pixels moved)
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	// Ball colision with top and bottom walls 
	if (ballY < ballSize || ballY > canvas.height - ballSize)
		ballSpeedY = -ballSpeedY;

	// Ball colision with paddles (Left & Right)
	if (ballX < paddleWidth + ballSize && ballY > paddleLeftY && ballY < paddleLeftY + paddleHeight)
		ballSpeedX = -ballSpeedX

	if (ballX > canvas.width - paddleWidth - ballSize && ballY > paddleRightY && ballY < paddleLeftY + paddleHeight)
		ballSpeedX = -ballSpeedX
}

// Draw objects on canvas
function draw() {
	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw paddles
	ctx.fillStyle = "black";
	ctx.fillRect(0, paddleLeftY, paddleWidth, paddleHeight);
	ctx.fillRect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight);

	// Draw ball
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
	ctx.fillStyle = "black";
	ctx.fill(); //This line fills the current path

console.log("Paddles and ball drawn successfully");

	requestAnimationFrame(gameLoop); //This line requests the browser to call a specified function --> This creates an animation loop by recursively calling gameLoop
}

document.addEventListener("keydown", function(event) {
  switch(event.key) {
    case "w":
      if (paddleLeftY > 0) {
        paddleLeftY -= 10;
      }
      break;
    case "s":
      if (paddleLeftY < canvas.height - paddleHeight) {
        paddleLeftY += 10;
      }
      break;
    case "ArrowUp":
      if (paddleRightY > 0) {
        paddleRightY -= 10;
      }
      break;
    case "ArrowDown":
      if (paddleRightY < canvas.height - paddleHeight) {
        paddleRightY += 10;
      }
      break;
  }
});

gameLoop();