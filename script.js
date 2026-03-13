const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const size = 30;

let snake = [{x:10,y:10}];
let direction = "right";

let apple = {x:5,y:5};

let score = 0;
let level = 1;

let running = true;

let soundEnabled = true;

/* AUDIO 8-BIT */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq,duration){

if(!soundEnabled) return;

const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();

osc.type="square";
osc.frequency.value=freq;

osc.connect(gain);
gain.connect(audioCtx.destination);

osc.start();

gain.gain.setValueAtTime(0.1,audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+duration);

osc.stop(audioCtx.currentTime+duration);

}

/* SONS */

function eatSound(){

playBeep(700,0.08);
setTimeout(()=>playBeep(900,0.08),80);

}

function deathSound(){

playBeep(300,0.2);
setTimeout(()=>playBeep(200,0.2),200);
setTimeout(()=>playBeep(100,0.3),400);

}

function backgroundMusic(){

playBeep(440,0.1);
setTimeout(()=>playBeep(660,0.1),120);
setTimeout(()=>playBeep(550,0.1),240);

}

/* DESENHO */

function drawSnake(){

snake.forEach(part=>{

ctx.fillStyle="white";

ctx.beginPath();
ctx.roundRect(part.x*size,part.y*size,28,28,10);
ctx.fill();

});

}

function drawApple(){

ctx.fillStyle="red";

ctx.beginPath();
ctx.arc(
apple.x*size+15,
apple.y*size+15,
10,
0,
Math.PI*2
);

ctx.fill();

}

/* SPAWN */

function spawnApple(){

apple.x=Math.floor(Math.random()*20);
apple.y=Math.floor(Math.random()*20);

}

/* MOVIMENTO */

function move(){

let head={...snake[0]};

if(direction==="right") head.x++;
if(direction==="left") head.x--;
if(direction==="up") head.y--;
if(direction==="down") head.y++;

snake.unshift(head);

if(head.x===apple.x && head.y===apple.y){

score++;

eatSound();

spawnApple();

updateLevel();

}else{

snake.pop();

}

checkCollision();

}

/* COLISÃO */

function checkCollision(){

let head=snake[0];

if(head.x<0 || head.y<0 || head.x>=20 || head.y>=20){

gameOver();

}

for(let i=1;i<snake.length;i++){

if(head.x===snake[i].x && head.y===snake[i].y){

gameOver();

}

}

}

/* NÍVEIS */

function updateLevel(){

if(score>=15){

level=3;

}else if(score>=10){

level=2;

}else{

level=1;

}

document.getElementById("score").innerText="🍎 "+score;
document.getElementById("level").innerText="🏆 Nível "+level;

}

/* GAME OVER */

function gameOver(){

running=false;

deathSound();

document.getElementById("gameOver").style.display="block";

}

/* LOOP */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

drawSnake();
drawApple();

}

function gameLoop(){

if(!running) return;

move();
draw();

backgroundMusic();

setTimeout(gameLoop,120-(level*20));

}

/* CONTROLES */

document.addEventListener("keydown",e=>{

if(e.key==="ArrowRight" && direction!=="left") direction="right";
if(e.key==="ArrowLeft" && direction!=="right") direction="left";
if(e.key==="ArrowUp" && direction!=="down") direction="up";
if(e.key==="ArrowDown" && direction!=="up") direction="down";

});

/* MENU */

function toggleMenu(){

let menu=document.getElementById("menu");

menu.style.display=
menu.style.display==="flex"?"none":"flex";

}

function pauseGame(){

running=false;

}

function resumeGame(){

if(!running){

running=true;
gameLoop();

}

}

function toggleSound(){

soundEnabled=!soundEnabled;

}

function restartGame(){

snake=[{x:10,y:10}];
direction="right";
score=0;
level=1;

spawnApple();

running=true;

document.getElementById("gameOver").style.display="none";

gameLoop();

}

spawnApple();
gameLoop();
canvas.width = window.innerWidth * 0.9
canvas.height = window.innerWidth * 0.9