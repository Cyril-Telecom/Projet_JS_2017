var canvas = document.getElementById("cv");
var context = canvas.getContext("2d");

//Affichage du sol
var drawGrass = function(){
	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 16; j++) {
			context.drawImage(grass, i*50, j*50);
		}
	}
};

// variable
var grass = new Image();
var pointeur= new Image();
// chargement image 
if (grass.src = "grass.png") {
	grass.onload = drawGrass;
	pointeur.src = "viseur.png";
}


canvas.onmouseover=function(){
	alert("nnnnnnnnnnnnnnnnn!");
}
//onmouseover


























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