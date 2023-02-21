// function secret()
// {
//     document.getElementById("secret").style.display = "none";
// }

var canvas = document.getElementById("CB_Canvas");
var ctx = canvas.getContext("2d");




let lvlSpan = document.getElementById("CB_lvl");
let scoreSpan = document.getElementById("CB_sscore");

const buttons =  document.getElementsByClassName("CB_button");
const play = buttons[0];
const retry = buttons[1];
const next = buttons[2];

//GAME SETTINGS
let ballSize = 10;

let defaultBarSize= 50;
let barSize = defaultBarSize;

let barHeight = 5
let gameSpeed = 20;
let gameOver = false;
let levelOver = false;


var ballX = canvas.width/2;
var ballY = canvas.height*0.8;
var dx = 1;
var dy = -1;

let lvl = 0;
let score = 0;
function CB_commencerJeu()
{
    lvl = 0;
    scoreSpan.innerHTML="SCORE : 0";
    play.style.display = "none";
    setInterval(gameLoop, gameSpeed);
    CB_nextLevel();
}


function CB_nextLevel()
{
    lvl++;
    if(lvl < 14)
    {
        lvl = 14;
    }

    lvlSpan.innerHTML = "LVL "+lvl;

    next.style.display="none";
    brickColumnCount = 2 + Math.floor(lvl/2)
    brickRowCount = 1 + Math.floor(lvl/3)
    calcBricks();
    //re setup la balle et augment la vitesse
    ballX = canvas.width/2 + ((Math.round(Math.random()) * 2 - 1)*Math.random()*canvas.width/4);
    ballY = canvas.height*0.8;
    dx = (Math.round(Math.random()) * 2 - 1)*(1+lvl*0.2);
    dy = -(1+lvl*0.2);

    ballTrailX = [];
    ballTrailY = [];


    barSize = defaultBarSize-lvl;
    if(barSize <15)
    {
        barSize = 15;
    }

    levelOver = false;
}

function CB_retryLevel(){
    retry.style.display="none";

    if(lvl == 1)
    {
        lvl = 0
    }
    else
    {
        lvl -= 2;
    }
    
    
    
    gameOver = false;
    CB_nextLevel();
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
    ctx.fillStyle = "#242170";
    ctx.fill();

    ctx.closePath();
}

   


let ballTrailX = [];
let ballTrailY = [];
let nbTrail = 20;
function drawBallTrail()
{
    if(ballTrailX.length == nbTrail)
    {
        ballTrailX.pop();
    }
    ballTrailX.unshift(ballX);
    ballTrailY.unshift(ballY);

    

    for(let i = 0;i<ballTrailX.length;i++)
    {
        let trailSize = ballSize-((10/nbTrail)*i);
        ctx.beginPath();
        ctx.rect(ballTrailX[i]-trailSize/2,ballTrailY[i]-trailSize/2, trailSize,trailSize);
        // ctx.fillStyle = "rgb("+(133+((255-133)/nbTrail)*i)+","+(138+((255-138)/nbTrail)*i)+",255)";
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.closePath();
        
    }

    
}

var barX = canvas.width/2;
var barY = canvas.height*0.9;
function drawBar()
{
    barPos();
    ctx.beginPath();

    ctx.rect(barX, barY, barSize,barHeight);
    ctx.fillStyle = "#242170";
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
        drawBallTrail();
        drawBall();
        mouvementBalle();
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
        score -=brickTotal;
        scoreSpan.innerHTML="SCORE : "+score;
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
let bricksRemaining = brickTotal;
let brickOffsetTop = 0;
let brickOffsetLeft = 0;

//NE PAS MODIFIER
let brickWidth = 0;
let brickHeight = 0;

const bricks = [];

function calcBricks()
{
    brickTotal = brickColumnCount*brickRowCount;
    bricksRemaining = brickTotal;
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
            bricksRemaining--;
            b.status = 0;
            if(bricksRemaining==0)
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


