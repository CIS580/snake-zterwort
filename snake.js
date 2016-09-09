/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();
var paused = true;
var endGame = false;
pauseScreen = new Image();
pauseScreen.src = 'PauseScreen.png';
gameOverScreen = new Image();
gameOverScreen.src = 'GameOverScreen.png';

var score = 0;
var randomx = Math.floor((Math.random() * frontBuffer.width - 1) + 1);
var randomy = Math.floor((Math.random() * frontBuffer.height - 1) + 1);
var snakebody = [];
var apple = {
  x: randomx,
  y: randomy
}
frontCtx.fillStyle="#FF0000";
frontCtx.fillRect(randomx,randomy,8,8);

function createSnake(){
  snakebody = [];
    snakebody.push({x:20, y:0});
    snakebody.push({x:15, y:0});
    snakebody.push({x:10, y:0});
    snakebody.push({x:5, y:0});
}

var input =
{
  up: false,
  down: false,
  left: false,
  right: false
}

document.onkeydown = function(event)
{
  switch(event.keyCode)
  {

    case 13:
    event.preventDefault();
    if(endGame == true){
      init();
    }
    break;

    case 27:
      event.preventDefault();
      pauseGame();
      break;

    //Up
    case 38:
    case 87:
      event.preventDefault();
      if(input.down != true){
      input.up = true;
      input.down = false;
      input.right = false;
      input.left = false;
      }
      break;

      //Left
    case 37:
    case 65:
      event.preventDefault();
      if(input.right != true){
      input.up = false;
      input.down = false;
      input.right = false;
      input.left = true;
      }
      break;

      //Right
    case 38:
    case 68:
      event.preventDefault();
      if(input.left != true){
      input.up = false;
      input.down = false;
      input.right = true;
      input.left = false;
      }
      break;

      //Down
    case 40:
    case 83:
      event.preventDefault();
      if(input.up != true){
      input.up = false;
      input.down = true;
      input.right = false;
      input.left = false;
      }
      break;
  }
}

function init(){
  endGame = false;
  score = 0;
  createSnake();
  input.up = false;
  input.down = false;
  input.right = true;
  input.left = false;
  game = setTimeout(loop, 1000 / 30);
}
init();

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {

  if(paused){
    frontCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
    frontCtx.drawImage(pauseScreen, 0, 0);
    return;
  }
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;

  update(elapsedTime);
  render(elapsedTime);
  if(endGame){
    return;
  }

  // Flip the back buffer
  drawScore();
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  game = setTimeout(loop, 1000 / 30);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Spawn an apple periodically
  // TODO: Grow the snake periodically   // TODO: Determine if the snake has eaten an apple

  // TODO: Move the snake

  var moveX = snakebody[0].x;
  var moveY = snakebody[0].y;

  if(input.up){
    moveY -= 5;
  }
  if(input.left){
    moveX -= 5;
  }
  if(input.right){
    moveX += 5;
  }
  if(input.down){
    moveY += 5;
  }

  var end = snakebody.pop();
  end.x = moveX;
  end.y = moveY;
  snakebody.unshift(end);

  isSnakeTouchingApple(snakebody[0], apple);

  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  if (snakebody[0].x < -1 || snakebody[0].y < -1 || snakebody[0].x > frontBuffer.width || snakebody[0].y > frontBuffer.height){
    gameOver();
  }
  // TODO: Determine if the snake has eaten its tail
  for(i=1; i < snakebody.length; i++){
    if((snakebody[0].x == snakebody[i].x) && (snakebody[0].y == snakebody[i].y)){
      gameOver();
    }
  }
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
  backCtx.fillStyle = "white";
  backCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer
  for(i=0;i<snakebody.length;i++){
      backCtx.fillStyle = 'black';
      backCtx.fillRect(snakebody[i].x,snakebody[i].y,10,10);
  }
    backCtx.fillStyle = 'red';
    backCtx.fillRect(apple.x,apple.y,10,10);
}

function isSnakeTouchingApple(position1, position2){
  if((position1.x < position2.x+10 && position1.x > position2.x-10) && (position1.y < position2.y+10 && position1.y > position2.y-10)){
    randomx = Math.floor((Math.random() * frontBuffer.width - 1) + 1);
    randomy = Math.floor((Math.random() * frontBuffer.height - 1) + 1);
    apple = {
      x: randomx,
      y: randomy
    }
    for(i=0; i < 5; i++){
    var bodySection = {
      x: snakebody[snakebody.length-1].x,
      y: snakebody[snakebody.length-1].y
    }
    snakebody.push(bodySection);
    score += 10;
    drawScore();
  }
  }
}

function gameOver(){
  endGame = true;
  clearTimeout(game);
  frontCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
  frontCtx.drawImage(gameOverScreen, 0, 0);
  drawScore();
}
//Took this from http://atomicrobotdesign.com/blog/web-development/pause-your-html5-canvas-game/
function pauseGame(){
  if(paused != true){
    clearTimeout(game);
    pauseScreen = new Image();
    pauseScreen.src = 'PauseScreen.png';
    frontCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
    frontCtx.drawImage(pauseScreen, 0, 0);
    paused = true;
  }
  else if (paused == true) {
    game = setTimeout(loop, 1000 / 30);
    paused = false;
  }
}

var drawScore = function() {
    var text = "Score: " + score;
    frontCtx.fillStyle = 'blue';
    frontCtx.fillText(text, 10, frontBuffer.height-5);
    backCtx.fillStyle = 'blue';
    backCtx.fillText(text, 10, frontBuffer.height-5);
  }
