var canvas = document.getElementById("cv");
var context = canvas.getContext("2d");


var x = 0;
var y = 0;
var sx = 0;
var sy = 0;
var zombieType = {sx : 0, sy : 0, swidth : 32, sheight : 32, positionX : 0, positionY : 0, width : 32, height : 32};
var tabZombies = [];
var graveType = {sx : 0, sy : 0, swidth : 80, sheight : 121, positionX : 0, positionY : 0, width : 32, height : 48};
var tabGraves = [];
//requestannimationframe
// variable
var grass = new Image();
var graveImage = new Image();
var zombieImage = new Image();
var pointeur = new Image();

// chargement des images 
graveImage.src = "Gravestone.png";
graveImage.onload = drawGrave;

zombieImage.src = "ZombieSprite.png";
zombieImage.onload = drawZombies;

grass.src = "grass.png";
grass.onload = drawGrass;
//pointeur.src = "viseur.png";
//pointeur.onload = 


//Affichage du sol
var drawGrass = function(){
	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 16; j++) {
			context.drawImage(grass, i*50, j*50);
		}
	}
};

//Affichage des tombes
var drawGrave = function(){
	for (var i = tabGraves.length - 1; i >= 0; i--) {
		context.drawImage(graveImage, tabGraves[i].sx, tabGraves[i].sy, tabGraves[i].swidth, tabGraves[i].sheight, tabGraves[i].positionX, tabGraves[i].positionY, tabGraves[i].width, tabGraves[i].height);
	}
};
//Affichage des zombies
//chaque zombie fait 32x32
var drawZombies = function(){
	console.log(tabZombies.length);
	for (var i = tabZombies.length - 1; i >= 0; i--) {
		//console.log(zombieImage, tabZombies[i].sx, tabZombies[i].sy, tabZombies[i].swidth, tabZombies[i].sheight, tabZombies[i].positionX, tabZombies[i].positionY, tabZombies[i].width, tabZombies[i].height);
		context.drawImage(zombieImage, tabZombies[i].sx, tabZombies[i].sy, tabZombies[i].swidth, tabZombies[i].sheight, tabZombies[i].positionX, tabZombies[i].positionY, tabZombies[i].width, tabZombies[i].height);
	}
};

// viseur 
canvas.onmouseover = function(){
	this.style.cursor = "url('curseur.cur'), auto";
};

//Ajout d'une tombe et d'un zombie
var emergenceZombieAndGrave = function(){
	//abscisse
	var n = Math.random() * 600;
	//ordonnée
	var m = Math.random() * 100;

	var a = {sx : 0, sy : 0, swidth : 32, sheight : 32, positionX : 0, positionY : 0, width : 32, height : 32};
	var b = {sx : 0, sy : 0, swidth : 80, sheight : 121, positionX : 0, positionY : 0, width : 32, height : 48};
	
	a.positionX = n;
	b.positionX = n;
	a.positionY = m;
	b.positionY = m;
	
	tabZombies.push(a);
	tabGraves.push(b);
};

var moveZombies = function(){
	for (var i = tabZombies.length - 1; i >= 0; i--) {
/*		context.drawImage(zombieImage,0,0,64,64, 0,0, 100, 100);
		console.log(zombieImage, tabZombies[i].sx, tabZombies[i].sy, tabZombies[i].swidth, tabZombies[i].sheight, 
		tabZombies[i].positionX, tabZombies[i].positionY, tabZombies[i].width, tabZombies[i].height);*/
		tabZombies[i].sx = (tabZombies[i].sx + 32 ) % 96;
		tabZombies[i].positionY = tabZombies[i].positionY + 10;
	}
};


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var start = null;

function step(timestamp) {
	var progress;
	if (start === null) start = timestamp;
	progress = timestamp - start;
	if (progress > 500){
		start = timestamp;
		context.clearRect(0, 0, 600, 800);
		drawGrass();
		drawGrave();
		drawZombies();
		moveZombies();
		emergenceZombieAndGrave();
	}
	requestAnimationFrame(step);
};

requestAnimationFrame(step);









/*
var audio = document.createElement("Audio");
var drawPikachu = function(){
	console.log(pikachu, sx, sy, 64, 64, x, y, 64, 64);
	context.drawImage(pikachu, sx, sy, 64, 64, x, y, 64, 64);
};
var drawEclair = function(){
	context.drawImage(pikachu, col2 * 64, 256, 64, 64, x, y, 64, 64);
};
var soundEclair = function(){
	audio.playSound();
}
audio.src = "kachu.wav";
var pikachu = new Image();
*/