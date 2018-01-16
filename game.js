var canvas = document.getElementById("cv");
var context = canvas.getContext("2d");

//déclaration des variables
var jeu = new Jeu();

//Tableaux qui contiennent l'ensemble des zombies et des tombes. Ils sont actualisés dans les fonctions drawGraves et drawZombies
var tabZombies = [];
var tabGraves = [];

var pause = false;//booléen vrai si le jeu est en pause et faux si le jeu n'est pas en pause
var bossPasApparu = true;//booléen vrai si le boss N'EST PAS encore apparu et faux si le boss est DEJA apparu
var bossPasApparu = true;//booléen vrai si le boss N'EST PAS encore apparu et faux si le boss est DEJA apparu

var grass = new Image();//image de l'herbe
var graveImage = new Image();//image sprite des tombes
var zombieImage = new Image();//image sprite des zombies
var zombieImageRed = new Image();//image sprite des zombies rouges
var pointeur = new Image();//image du pointeur cible

// chargement des images 
graveImage.src = "Gravestone.png";
graveImage.onload = drawGraves;

zombieImage.src = "ZombieSprite.png";
zombieImage.onload = drawZombies;

zombieImageRed.src = "ZombieSpriteRed.png";
zombieImageRed.onload = drawZombies;

grass.src = "grass.png";
grass.onload = drawGrass;

// chargement des sons
var shoot = document.createElement("Audio");
shoot.src = "pistol-sound-effect.mp3";
var sound = document.createElement("Audio");
sound.src = "sound_bg.mp3";
sound.play();

// Changement de l'image du pointeur en viseur 
canvas.onmouseover = function(){
	this.style.cursor = "url('curseur.cur'), auto";
};

canvas.onmouseup = function(e){
	if(pause === false){
		var x = e.offsetX;
		var y = e.offsetY ;
		for (var i = 0; i < tabZombies.length; i++) {
			if (tabZombies[i].isHere(x, y)){//le zombie est-il là ?
				tabZombies[i].loseHP();//le zombie perd un pv
				if (tabZombies[i].getHP() <= 0) {
					jeu.setPointsVictoire(tabZombies[i].getPoint());//gain de points à la mort d'un zombie
					tabZombies.splice(i, 1);//supprime le zombie du tableau
				}
			}
		}
		shoot.play();
	}	
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
		//Elimination des tombes de plus de 20 secondes
		if (jeu.getTempsJeu() - tabGraves[i].getTime() > 20000) {
			tabGraves.splice(i, 1);
		}
	}
};

//Affichage des zombies + affichage des informations du jeu
var drawZombies = function(){
	for (var i = 0; i < tabZombies.length; i++) {
		tabZombies[i].draw();
		if (tabZombies[i].getImage() === zombieImageRed) tabZombies[i].setImage(zombieImage);
	}
	context.fillStyle = "white";
	context.font = "24px arial Bold";
	var tempsRestant = Math.abs(200000 - jeu.getTempsJeu());
	context.fillText(Math.floor(tempsRestant/60000) + " min " + Math.floor(tempsRestant%60000/1000) + " s", 10, 20);// temps restants
	// affichagepoint de vie restant	
	context.fillText("PV : " + jeu.getpointDeVie(), 300 , 20);
	// total des points du joueur
	context.fillText("Points : " + jeu.getPointsVictoire(), 450, 20);
};

// déplacement des zombies
var moveZombies = function(){
	for (var i = 0; i < tabZombies.length; i++) {
		tabZombies[i].move();
		if (tabZombies[i].isBot()) { //si le zombie arrive en bas 
			jeu.addPointDeVie(-1);//le joueur perd un pv
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
var emergenceZombieAndGrave = function(){
	var positionX = Math.random() * (600 - 64);
	var positionY = Math.random() * 100;

	//Génération du zombie
	var c;
	var d;
	if (jeu.getTempsJeu() < 30000){//zombie faible
		d = 0;
		c = 0;
	}else if(jeu.getTempsJeu() < 100000){//zombie faible et moyen
		d = getRandomInt(0,1);
		c = 0;
	}else if (jeu.getTempsJeu() < 140000) {//zombie faible, moyen et fort
		do{
			var d = getRandomInt(0,3);
		} while (d === 2)
		c = 0;
	}else{//zombie faible, moyen, fort et boss
		if(bossPasApparu === true){
			c=1;
			d=1;
			bossPasApparu = false;
		}else{
			do{
				var d = getRandomInt(0,3);
			} while (d === 2)
			c = 0;
		}
	}
	var a = new Zombie (positionX, positionY, c, d);
	a.add();

	//Génération de la tombe
	var b = new Grave (positionX, positionY, getRandomInt(0,1), getRandomInt(0,1), jeu.getTempsJeu());
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
			context.fillStyle = "black";
			context.font = "82px Impact";
			context.fillText("PAUSE", 200, 400);
		}
	}
};

/*Fonction qui met en pose */
var end = function(a){
	pause = true;
	context.fillStyle = "rgba(250, 250, 250, 0.5)";
	context.fillRect(0, 0, 600, 800);
	context.fillStyle ="black";
	context.font = "30px Impact";
	context.fillText(a, 150, 400);
};

/**
*	Fonction qui permet de changer le temps d'aparition des zombies 
*	a partir de 2min20 le temps passe a 1s au lieu de 2s 
*
**/
var changeTime = function(t){
	if(t < 140000){
		return 2000;
	}
	return 1000;
}


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var start = null;
var flag = null;
var flag2 = null;
var flag3 = null;

function step(timestamp) {
	if(pause === true)	{
		flag3 = timestamp;
		flag2 = timestamp;
		flag = timestamp;
	}else if (pause === false){
		//tant que le joueur a des points de vie et que le temps n'est pas dépassé
		if (jeu.getpointDeVie() > 0 && jeu.getTempsJeu() < 200000){
			if (start === null) {
				start = timestamp;
				flag = start;
				flag2 = start;
				flag3 = start;
			}
			if (timestamp - flag3 > changeTime(jeu.getTempsJeu())) {
				flag3 = timestamp;
				emergenceZombieAndGrave(jeu.getTempsJeu());
			}
			if (timestamp - flag2 > 10) {
				//actualise le temps de jeu réel
				jeu.setTempsJeu(jeu.getTempsJeu() + timestamp - flag2);
				flag2 = timestamp;
				//affiche l'herbe, les tombes et les zombies
				context.clearRect(0, 0, 600, 800);
				drawGrass();
				drawGraves();
				drawZombies();
			}
			if (timestamp - flag > 175){
				flag = timestamp;
				moveZombies();
			}		
		}else if (jeu.getpointDeVie() <= 0){
			end("You lose !");
		}else{
			end("You win with " + jeu.getPointsVictoire() + " points");
		}
	}
	requestAnimationFrame(step);
}
requestAnimationFrame(step);