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
	var x = e.pageX - 375;
	var y = e.pageY - 50;
/*	console.log(x);
	console.log(y);*/
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

class Jeu {
	constructor(){
		this.pointsVictoire = 0;
		this.tempsJeu = 0;
		this.pointDeVie = 10;
	}

	setPointDeVie (n){this.pointDeVie += n;}
	getpointDeVie(){return this.pointDeVie;}

	setTempsJeu(x){this.tempsJeu = x;}
	getTempsJeu(){return this.tempsJeu;}

	setPointsVictoire(x){this.pointsVictoire += x;}
	getPointsVictoire(){return this.pointsVictoire;}
}

class Zombie {
	constructor(n, m, c, d){
		//paramètres de l'image
		this.sx = d * 96;//abscisse du zombie dans l'image d'origine
		this.sy = c * 128;//ordonée du zombie dans l'image d'origine
		this.swidth = 32;//largeur du zombie sur l'image d'origine
		this.sheight = 32;//hauteur du zombie sur l'image d'origine
		this.positionX = n;//abscisse du zombie à afficher
		this.positionY = m;//ordonnée du zombie à afficher
		this.width = 32;//largeur du zombie à afficher
		this.height = 32;//hauteur du zombie à afficher
		this.image = zombieImage;
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
		} else if (d === 1){
			this.HP = 2;
			this.maxHP = 2;
			this.point = 3;
			this.speed = 0.6;//lent
			if (c === 1){
				this.HP = 25;
				this.maxHP = 25;
				this.point = 30;
				this.speed = 0.4;//très lent
				this.width = 1.5*this.width;
				this.height = 1.5*this.height;
			}
		} else if(d === 3){
			this.HP = 3;
			this.maxHP = 3;
			this.point = 5;
			this.speed = 0.8;//modéré
		}
	}
	//ajoute un zombie à tabZombies
	add(){tabZombies.push(this);}
	//Affichage des zombies et de leur barre de vie
	//chaque zombie fait 32x32
	draw(){
		context.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, this.positionX, this.positionY, this.width, this.height);
		//choix de la couleur
		if (this.HP === this.maxHP) {
			context.fillStyle = "#00FF00";//vert
		}else if (this.HP > (this.maxHP)/2){
			context.fillStyle = "#FF9900";//orange
		}else if (this.HP <= (this.maxHP)/2){
			context.fillStyle = "#FF0000";//rouge
		}
		//Affichage de la barre de vie
		context.fillRect(this.positionX, this.positionY - 5, this.width * this.HP / this.maxHP, 1);

/*		if (this.maxHP >= 2) {
			for (var i = 1; i < this.maxHP; i++) {
				context.moveTo(this.positionX + this.width * i / this.maxHP, this.positionY - 5);
				context.lineTo(this.positionX + this.width * i / this.maxHP, this.positionY - 4);
				context.stroke();
			}
		}*/
	}
	move(){
		//Changement d'image du pas
		this.sx = (this.sx + this.swidth * this.sensDisplayImage) % 96 + this.colonne;
		if (this.sx === this.colonne || this.sx === this.colonne + 2 * this.swidth) {
			this.sensDisplayImage *= -1;
		}
		//déplacmeent de l'image
		this.positionY = this.positionY + 10 * this.speed;
	}
	//retourne vrai si le curseur est bien dans le carré de l'image du zombie
	isHere(x, y){
		if ((this.positionX < x) && (x < this.positionX + this.width) && (this.positionY < y) && (y < this.positionY + this.height)) {
			return true;
		}
		return false;
	}
	loseHP(){
		this.HP--;
		this.image = zombieImageRed;
	}
	getHP(){return this.HP;}
	isBot(){
		if (this.positionY > 800 - this.height) return true;
		return false;
	}
	getPoint(){return this.point;}
	setImage(img){this.image = img;}
	getImage(){return this.image;}
}

class Grave {
	constructor(n, m, e, f, timestamp){
		//paramètres de l'image
		this.sx = e * 80;
		this.sy = f * 121;
		this.swidth = 80;
		this.sheight = 121;
		this.positionX = n;
		this.positionY = m;
		this.width = 32;
		this.height = 48;

		this.time = timestamp;
	}
	add(){
		tabGraves.push(this);
	}
	getTime(){
		return this.time;
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