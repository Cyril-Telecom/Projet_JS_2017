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
var zombieImageRed = new Image();
var pointeur = new Image();

// chargement des images 
graveImage.src = "Gravestone.png";
graveImage.onload = drawGraves;

zombieImage.src = "ZombieSprite.png";
zombieImage.onload = drawZombies;

zombieImageRed.src = "ZombieSpriteRed.png";
zombieImageRed.onload = drawZombies;

grass.src = "grass.png";
grass.onload = drawGrass;


var shoot = document.createElement("Audio");
shoot.src = "pistol-sound-effect.mp3";

// viseur 
canvas.onmouseover = function(){
	this.style.cursor = "url('curseur.cur'), auto";
};

canvas.onmouseup = function(e){
	var x = e.offsetX;
	var y = e.offsetY ;
	/*var x = e.clientX;
	var y = e.clientY;*/
	console.log("viseur x: "+ x+ " y: "+ y);
	console.log("1er zombie x: " + tabZombies[0].positionX+ " y:"+ tabZombies[0].positionY);
	for (var i = 0; i < tabZombies.length; i++) {
		//console.log(tabZombies[i].isHere(x, y));
		if (tabZombies[i].isHere(x, y)){//le zombie est-il là ?
			tabZombies[i].loseHP();//le zombie perd un pv
			if (tabZombies[i].getHP() <= 0) {
				jeu.setPointsVictoire(tabZombies[i].getPoint());//gain de points à la mort d'un zombie
				tabZombies.splice(i, 1);//supprime le zombie du tableau
			}
		}
	}
	shoot.play();
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
var drawGraves = function(timestamp){
	//console.log("nb de tombe = "+tabGraves.length);
	for (var i = tabGraves.length - 1; i >= 0; i--) {
		tabGraves[i].draw();
		if (timestamp - tabGraves[i].getTime() > 10000) {
			tabGraves.splice(i, 1);
		}
	}
};

var drawZombies = function(){
	for (var i = 0; i < tabZombies.length; i++) {
		tabZombies[i].draw();
		if (tabZombies[i].getImage() === zombieImageRed) {tabZombies[i].setImage(zombieImage);}
	}
};

var moveZombies = function(){
	for (var i = 0; i < tabZombies.length; i++) {
		tabZombies[i].move();
		if (tabZombies[i].isBot()) {
			jeu.setPointDeVie(-1);//le joueur perd un pv
			tabZombies.splice(i, 1);//supprime le zombie du tableau
		}
	}
};







/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Ajout d'une tombe aléatoire et d'un zombie aléatoire
var emergenceZombieAndGrave = function(temps, timestamp){
	var positionX = Math.random() * (600 - 64);
	var positionY = Math.random() * 100;

	//Génération du zombie
	var c;
	var d;
	if (temps < 30){//zombie faible
		d = 0;
		c = 0;
	}else if(temps < 100){//zombie faible et moyen
		d = getRandomInt(0,1);
		c = 0;
	}else if (temps < 140) {//zombie faible, moyen et fort
		do{
			var d = getRandomInt(0,3);
		} while (d === 2)
		c = 0;
	}else{//zombie faible, moyen, fort et boss
		do{
			var d = getRandomInt(0,3);
		} while (d === 2)
		do{
			var c = getRandomInt(0,1);
		} while (c === 1 && (d === 0 || d === 3))
	}
	var a = new Zombie (positionX, positionY, c, d);
	a.add();

	//Génération de la tombe
	var e = getRandomInt(0,1);
	var f = getRandomInt(0,1);
	var b = new Grave (positionX, positionY, e, f, timestamp);
	b.add();
};


// la pause sur le bouton "p"
document.onkeydown = function (e) {
	if(e.key === "p"){
		if(pause === true){
			pause = false;
			requestAnimationFrame(step);
		}else{
			pause = true;
			context.fillStyle = "rgba(250, 250, 250, 0.5)";
			context.fillRect(0, 0, 600, 800);
			context.fillStyle ="black";
			context.font = "82px Impact";
			context.fillText("PAUSE", 200, 400);
			context.font = "10px arial";
			context.fillText("Temps de jeu : " + Math.floor(jeu.getTempsJeu()/60000) + " : " + Math.floor(jeu.getTempsJeu()%60000/1000), 0, 10);
			context.fillText("PV : " + jeu.getpointDeVie(), 0 , 20);
			context.fillText("Point(s) : " + jeu.getPointsVictoire(), 0, 30);
		}
	}
}

var end = function(a){
	pause = true;
	context.fillStyle = "rgba(250, 250, 250, 0.5)";
	context.fillRect(0, 0, 600, 800);
	context.fillStyle ="black";
	context.font = "82px Impact";
	context.fillText(a, 150, 400);
	context.font = "10px arial";
	context.fillText("Temps de jeu : " + Math.floor(jeu.getTempsJeu()/60000) + " : " + Math.floor(jeu.getTempsJeu()%60000/1000), 0, 10);
	context.fillText("PV : " + jeu.getpointDeVie(), 0 , 20);
	context.fillText("Point(s) : " + jeu.getPointsVictoire(), 0, 30);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var start = null;
var flag = null;
var flag2 = null;
var jeu = new Jeu();

function step(timestamp) {
	if(pause === true) return;
	//tant que le joueur a des points de vie
	if (jeu.getpointDeVie() > 0){
	var progress;
	var progress2;
		if (start === null) {
			start = timestamp;
			flag = start;
			flag2 = start;
		}
		progress = timestamp - flag;
		progress2 = timestamp - flag2;
		if (progress2 > 100) {
			flag2 = timestamp;
			context.clearRect(0, 0, 600, 800);
			drawGrass();
			drawGraves(timestamp);
			drawZombies();
		}
		if (progress > 750){
			flag = timestamp;
			jeu.setTempsJeu(timestamp - start);
			moveZombies();
			emergenceZombieAndGrave(jeu.getTempsJeu(),timestamp);
		}		
	}else{
		end("You lose !");
	}
	requestAnimationFrame(step);
}

requestAnimationFrame(step);