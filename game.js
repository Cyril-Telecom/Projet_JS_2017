var canvas = document.getElementById("cv");
var context = canvas.getContext("2d");

//déclaration des variables
var x = 0;
var y = 0;
var sx = 0;
var sy = 0;
//var zombieType = {sx : 0, sy : 0, swidth : 32, sheight : 32, positionX : 0, positionY : 0, width : 32, height : 32};
var tabZombies = [];
//var graveType = {sx : 0, sy : 0, swidth : 80, sheight : 121, positionX : 0, positionY : 0, width : 32, height : 48};
var tabGraves = [];
var pause;
var grass = new Image();
var graveImage = new Image();
var zombieImage = new Image();
var pointeur = new Image();

// chargement des images 
graveImage.src = "Gravestone.png";
graveImage.onload = drawGraves;

zombieImage.src = "ZombieSprite.png";
zombieImage.onload = drawZombies;

grass.src = "grass.png";
grass.onload = drawGrass;

// viseur 
canvas.onmouseover = function(){
	this.style.cursor = "url('curseur.cur'), auto";
};

//Affichage du sol
var drawGrass = function(){
	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 16; j++) {
			context.drawImage(grass, i*50, j*50);
		}
	}
};

//Affichage des tombes
var drawGraves = function(){
	for (var i = tabGraves.length - 1; i >= 0; i--) {
		tabGraves[i].draw();
	}
};

var drawZombies = function(){
	//console.log(tabZombies.length);
	for (var i = tabZombies.length - 1; i >= 0; i--) {
		//console.log(zombieImage, tabZombies[i].sx, tabZombies[i].sy, tabZombies[i].swidth, tabZombies[i].sheight, tabZombies[i].positionX, tabZombies[i].positionY, tabZombies[i].width, tabZombies[i].height);
		tabZombies[i].draw();
	}
};

class Zombie {
	constructor(n, m, c, d){
		this.sx = d * 96;//abscisse du zombie dans l'image d'origine
		this.sy = c * 128;//ordonée du zombie dans l'image d'origine
		this.swidth = 32;//largeur du zombie sur l'image d'origine
		this.sheight = 32;//hauteur du zombie sur l'image d'origine
		this.positionX = n;//abscisse du zombie à afficher
		this.positionY = m;//ordonnée du zombie à afficher
		this.width = 32;//largeur du zombie à afficher
		this.height = 32;//hauteur du zombie à afficher
		
		//ces 2 variables servent à mémoriser quel est le type de zombie zombie. Elles sont utiliser pour l'affichage du zombie
		this.colonne = d * 96;
		this.ligne = c * 128;

		this.sensDisplayImage = 1;

		//Définittion des PV, de la taille et de l'allure
		if (d === 0){
			this.HP = 1;
			this.maxHP = 1;
			this.point = 1;
			this.speed = 1;//rapide
			this.width = 1*this.width;
		} else if (d === 1){
			this.HP = 2;
			this.maxHP = 2;
			this.point = 3;
			this.speed = 0.6;//lent
			this.width = 1*this.width;
			if (c === 1){
				this.HP = 25;
				this.maxHP = 25;
				this.point = 30;
				this.speed = 0.4;//très lent
				this.width = 2*this.width;
				this.height = 2*this.height;
			}
		} else if(d === 3){
			this.HP = 3;
			this.maxHP = 3;
			this.point = 5;
			this.speed = 0.8;//modéré
			this.width = 1*this.width;
		}
	}

	add(){
		tabZombies.push(this);
	}

	delete(){
		
	}
	//Affichage des zombies et de leur barre de vie
	//chaque zombie fait 32x32
	draw(){
		context.drawImage(zombieImage, this.sx, this.sy, this.swidth, this.sheight, this.positionX, this.positionY, this.width, this.height);
		//Affichage de la barre de vie
		context.fillRect(this.positionX, this.positionY - 5, this.width * this.HP / this.maxHP, 1);
		//choix de la couleur
		if (this.HP === this.maxHP) {
			context.fillStyle = "#00FF00";//vert
		}else if (this.HP > this.maxHP/2) {
			context.fillStyle = "#FF9900";//orange
		}else if (this.HP < this.maxHP/2) {
			context.fillStyle = "#FF0000";//rouge
		}
	}
	move(){
		//Changement d'image du pas
		this.sx = (this.sx + this.width * this.sensDisplayImage) % 96 + this.colonne;
		if (this.sx === this.colonne || this.sx === this.colonne + 2 * this.width) {
			this.sensDisplayImage = - this.sensDisplayImage;
		}
		//déplacmeent de l'image
		this.positionY = this.positionY + 10 * this.speed;
	}
}

class Grave {
	constructor(n, m, e, f){
		this.sx = e * 80;
		this.sy = f * 121;
		this.swidth = 80;
		this.sheight = 121;
		this.positionX = n;
		this.positionY = m;
		this.width = 32;
		this.height = 48;
	}
	add(){
		tabGraves.push(this);
	}
	delete(){

	}
	draw(){
		context.drawImage(graveImage, this.sx, this.sy, this.swidth, this.sheight, this.positionX, this.positionY, this.width, this.height);
	}
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Ajout d'une tombe aléatoire et d'un zombie aléatoire
var emergenceZombieAndGrave = function(){
	var positionX = Math.random() * (600-64);
	var positionY = Math.random() * 100;

	//Généaration du zombie
	do{
		var d = getRandomInt(0,3);
	} while (d === 2)
	do{
		var c = getRandomInt(0,1);
	} while (c === 1 && (d === 0 || d === 3))
	var a = new Zombie (positionX, positionY, c, d);
	//Génération de la tombe
	var e = getRandomInt(0,1);
	var f = getRandomInt(0,1);
	var b = new Grave (positionX, positionY, e, f);
	a.add();
	b.add();
};

var moveZombies = function(){
	for (var i = tabZombies.length - 1; i >= 0; i--) {
/*		context.drawImage(zombieImage,0,0,64,64, 0,0, 100, 100);
		console.log(zombieImage, tabZombies[i].sx, tabZombies[i].sy, tabZombies[i].swidth, tabZombies[i].sheight, 
		tabZombies[i].positionX, tabZombies[i].positionY, tabZombies[i].width, tabZombies[i].height);
		tabZombies[i].sx = (tabZombies[i].sx + 32 ) % 96;
		tabZombies[i].positionY = tabZombies[i].positionY + 10;*/
		tabZombies[i].move();
	}
};

// la pause sur le bouton "p"
document.onkeydown = function (e) {
	if(e.key=="p"){
		if(pause==true){
			pause=false;
			requestAnimationFrame(step);
		}else{
			pause=true;
			context.fillStyle = "rgba(250, 250, 250, 0.5)";
			context.fillRect(0, 0, 600, 800);
			context.fillStyle ="black";
			context.font = "82px Impact";
			context.fillText("PAUSE",200,400);
		}
		
	}
}


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var start = null;

function step(timestamp) {
	if(pause==true){return;}
	var progress;
	if (start === null) start = timestamp;
	progress = timestamp - start;
	if (progress > 500){
		start = timestamp;
		context.clearRect(0, 0, 600, 800);
		drawGrass();
		drawGraves();
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