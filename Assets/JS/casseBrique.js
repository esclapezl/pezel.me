var canvas = document.getElementById("Game");
var ctx = canvas.getContext("2d");


let buttons =  document.getElementsByClassName("button");

let lvlSpan = document.getElementById("lvl");
let scoreSpan = document.getElementById("score");

let play = buttons[0];
let retry = buttons[1];
let next = buttons[2];

//GAME SETTINGS
let ballSize = 10;
let barSize = 30;
let barHeight = 5
let gameSpeed = 10;
let gameOver = false;
let levelOver = false;


var ballX = canvas.width/2;
var ballY = canvas.height*0.8;
var dx = 1;
var dy = -1;

let lvl = 0;
let score = 0;
function commencerJeu()
{
    lvl = 0;
    scoreSpan.innerHTML="SCORE : 0";
    play.style.display = "none";
    setInterval(gameLoop, gameSpeed);
    nextLevel();
}


function nextLevel()
{
    lvl++;
    lvlSpan.innerHTML = "LVL "+lvl;

    next.style.display="none";
    brickColumnCount = 2 + Math.floor(lvl/2)
    brickRowCount = 1 + Math.floor(lvl/3)
    calcBricks();
    //re setup la balle et augment la vitesse
    ballX = canvas.width/2;
    ballY = canvas.height*0.8;
    dx = (1+lvl*0.2);
    dy = -(1+lvl*0.2);

    levelOver = false;
}

function retryLevel(){
    retry.style.display="none";
    lvl = 0;
    score = 0;
    scoreSpan.innerHTML="SCORE : 0";
    gameOver = false;
    nextLevel();
}

function gameLoop()
{
    
    if(!gameOver && !levelOver)
    {
        draw();
    }
    else
    {
        if(levelOver)
        {
            next.style.opacity = 1;
            next.style.display = "block";
        }
        else if(gameOver)
        {
            retry.style.display ="block"
        }
    }
}




function drawBall() {
    ctx.beginPath();

    ctx.rect(ballX-ballSize/2,ballY-ballSize/2, ballSize,ballSize);
    ctx.fillStyle = "#8A85FF";
    ctx.fill();

    ctx.closePath();

    mouvementBalle();
}

var barX = canvas.width/2;
var barY = canvas.height*0.9;
function drawBar()
{
    barPos();
    ctx.beginPath();

    ctx.rect(barX, barY, barSize,barHeight);
    ctx.fillStyle = "#8A85FF";
    ctx.fill();

    ctx.closePath();

    barPos();
}



function barPos()
{
    if(mouseX< w/4+barSize)
    {
        barX = 0;
    }
    else if(mouseX > w*0.75-barSize)
    {
        barX = canvas.width-barSize;
    }
    else
    {
        barX = (mouseX-(0.25*w))*canvas.width/(w/2)-barSize/2;
    }

}

function draw()
{
    if(!gameOver)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBar();
        collisionDetection();
        drawBricks();
    }
    
}

function mouvementBalle()
{
    //check si la balle tape le mur et inverse sa direction AXE X
    if(ballX+dx > canvas.width-ballSize/2
    || ballX+dx <= 0+ballSize/2)
    {
        dx = -dx;
    }
   
    //execute le mvmt
    ballX += dx;

    //check si la balle tape le mur et inverse sa direction AXE Y
    if(ballY+dy <= 0+ballSize/2)
    {
        dy = -dy;
    }
    else if(dy > 0                 //Verif que la balle va vers le bas
    && barY < ballY+dy      
    && ballY+dy< barY+barHeight           //verif que la balle se trouve dans la zone Y de la barre
    && barX-ballSize<ballX          
    && ballX<barX+barSize)     //verif que la balle se trouve dans la zone X de la barre
    {
        dy = -dy;

    }
    else if(ballY+dy > canvas.height-ballSize/2)
    {
        dy = 0;
        dx = 0;
        gameOver = true;
    }
    //execute le mvmt
    ballY += dy;
}

let mouseX = 0;
let w = window.innerWidth;
function mouseCoordinates(event){
    mouseX = event.clientX;
    w = window.innerWidth;
}




//BRIQUES 
const brickPadding = 5;

let brickRowCount = 1;
let brickColumnCount = 2;

let brickTotal = brickColumnCount*brickRowCount;
let brickOffsetTop = 0;
let brickOffsetLeft = 0;

//NE PAS MODIFIER
let brickWidth = 0;
let brickHeight = 0;

const bricks = [];

function calcBricks()
{
    brickTotal = brickColumnCount*brickRowCount;
    brickOffsetTop = canvas.height/10;
    brickOffsetLeft = canvas.width/20;

    //NE PAS MODIFIER
    brickWidth = ((canvas.width-brickOffsetLeft*2)-((brickColumnCount)*brickPadding))/brickColumnCount;
    brickHeight = (brickOffsetTop+canvas.height*0.3-((brickRowCount)*brickPadding))/brickRowCount;

    
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1  };
        }
    }
}





function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#8A85FF";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            ballX > b.x &&
            ballX < b.x + brickWidth &&
            ballY > b.y &&
            ballY < b.y + brickHeight
          ) {
            score++;
            scoreSpan.innerHTML = "SCORE : "+score;
            brickTotal--;
            b.status = 0;
            if(brickTotal==0)
            {
                levelOver = true;
                dy = 0;
                dx = 0;
            }
            else
            {
                dy = -dy;
            }
          }
        }
      }
    }
  }

window.addEventListener('mousemove', mouseCoordinates);


