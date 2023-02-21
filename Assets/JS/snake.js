var canvas = document.getElementById("SN_Canvas");
var ctx = canvas.getContext("2d");

let scoreSpan = document.getElementById("SN_score");
let highScoreSpan = document.getElementById("SN_highScore");
let score = 0;
let highScore = 0;

const buttons =  document.getElementsByClassName("SN_button");
const play = buttons[0];
const retry = buttons[1];


function SN_commencerJeu()
{
    play.style.display = "none";
    scoreSpan.innerHTML = "SCORE : "+score
    highScoreSpan.innerHTML = "HIGHSCORE : "+highScore
    foodX = snap(Math.random()*canvas.width);
    foodY = snap(Math.random()*canvas.height);
    setInterval(gameLoop, gameSpeed);
}

function SN_retry()
{
    gameOver = false;
    retry.style.display = "none";
    snakeBody = [[snap(canvas.width/2),snap(canvas.height/2)]];
    snakeLenght = startingSnakeLenght;
    score = 0;
    scoreSpan.innerHTML = "SCORE:"+score
}

let gameSpeed = 150;
let gameOver = false;
function gameLoop()
{
    if(!gameOver)
    {
        if(awaitingDirection.length != 0)
        {   
            snakeDirection = awaitingDirection.pop();
            awaitingDirection = [];
        }

        snakeMovement();
        foodCollision();
        
        //faire anim game over ici
        drawFrame();
        
        
        

        pressedAKey = false;
    }
    else
    {
       
        retry.style.display = "block";
    }
}

function drawFrame()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

let snakeSize = 10;
let startingSnakeLenght = 1;
let snakeLenght = startingSnakeLenght;
let snakeBody = [[snap(canvas.width/2),snap(canvas.height/2)]];
let snakeBackup = snakeBody;

//[x,y]
// 0 : droite, 
// 1 : bas, 
// 2 : gauche, 
// 3 : haut

const directions = [[1,0],[0,1],[-1,0],[0,-1]];
let snakeDirection = directions[0];
function drawSnake()
{
    for(let i = 0;i<snakeBody.length ;i++)
    {
        ctx.beginPath();

        ctx.rect(snakeBody[i][0],snakeBody[i][1],snakeSize,snakeSize);
        ctx.fillStyle = "#242170";
        if(gameOver)
        {
            ctx.fillStyle="RGB("+(200-((200-138)/snakeBody.length)*i)+",0,0)"
        }
        else
        {
            ctx.fillStyle="RGB("+(160-((160-138)/snakeBody.length)*i)+","+(220-((220-180)/snakeBody.length)*i)+",255)"
        }
        
        ctx.fill();

        ctx.closePath();
    }
}

function snakeMovement()
{
    let nextMovement = [(snakeBody[0][0] + (snakeDirection[0]*snakeSize)),(snakeBody[0][1] + (snakeDirection[1]*snakeSize))];   
    snakeCollision(nextMovement[0],nextMovement[1]);

    if(!gameOver)
    {
        snakeBody.unshift(nextMovement)
        if(snakeBody.length > snakeLenght)
        {
            snakeBody.pop();
        }
    }
    
}

function snakeCollision(x,y)
{
    if(x > snap(canvas.width)-snakeSize 
        || x < 0
        || y > snap(canvas.height)-snakeSize
        || y < 0)
    {
        gameOver = true;
    }

    //check si la tete collisione avec un bout du corps
    for(let i = 1; i<snakeBody.length; i++)
    {
        if(snakeBody[i][0] == snakeBody[0][0] && snakeBody[i][1] == snakeBody[0][1])
        {
            gameOver = true;
        }
    }
}



let foodValue = 3;
let foodX = 0;
let foodY = 0;
function drawFood()
{
    ctx.beginPath();

    ctx.rect(foodX,foodY,snakeSize,snakeSize);
    ctx.fillStyle = "#A19DFF";
    ctx.fill();

    ctx.closePath();
}

function snap(n)
{
    return Math.floor(n/snakeSize)*snakeSize;
}

function foodCollision()
{
    
    if(snakeBody[0][0] == foodX && snakeBody[0][1] == foodY)
    {
        score += foodValue;
        scoreSpan.innerHTML = "SCORE : "+score
        snakeLenght += foodValue;
        if(score > highScore)
        {
            highScore = score
            highScoreSpan.innerHTML = "HIGHSCORE : "+highScore
        }
        
        spawnFood();

        
    }
    
}

function spawnFood()
{
    let freeSpace = true;
    do{
        freeSpace = true;
        foodX = snap(Math.random()*canvas.width);
        foodY = snap(Math.random()*canvas.height);

        for(let i = 0; i<snakeBody.length && freeSpace; i++)
        {
            if(snakeBody[i][0] == foodX && snakeBody[i][1] == foodY)
            {
                freeSpace = false;
            }
        }

    }while(!freeSpace)
}

//fix les bugs si on touche sans lancer le jeu

let pressedAKey = false;
let awaitingDirection = [];
function change_direction(event) 
{  
   const LEFT_KEY = 37;
   const RIGHT_KEY = 39;
   const UP_KEY = 38;
   const DOWN_KEY = 40;
 
   const keyPressed = event.keyCode;

   let verticalMovement = (snakeDirection == directions[1] || snakeDirection == directions[3]);
   let horizontalMovement = (snakeDirection == directions[2] || snakeDirection == directions[0]);
   
    if(keyPressed === LEFT_KEY 
        && verticalMovement)
    {    
        if(pressedAKey)
        {
            awaitingDirection.concat(directions[2]);
        }
        else
        {
            snakeDirection = directions[2];
            pressedAKey = true;
        }
    }
    else if (keyPressed === UP_KEY
        && horizontalMovement)
    {    
        if(pressedAKey)
        {
            
            awaitingDirection.concat(directions[3]);
        }
        else
        {
            snakeDirection = directions[3];
            pressedAKey = true;
        }
    }
    else if (keyPressed === RIGHT_KEY
        && verticalMovement)
    {    
        if(pressedAKey)
        {
            
            awaitingDirection.concat(directions[0]);
        }
        else
        {
            snakeDirection = directions[0];
            pressedAKey = true;
        }
    }
    else if (keyPressed === DOWN_KEY
        && horizontalMovement)
    {    
        if(pressedAKey)
        {
            
            awaitingDirection.concat(directions[1]);
        }
        else
        {
            snakeDirection = directions[1];
            pressedAKey = true;
        }
    }
    
    
}
document.addEventListener("keydown", change_direction)

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

