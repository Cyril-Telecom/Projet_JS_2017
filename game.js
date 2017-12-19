var canvas = document.getElementById("cv");
var context = canvas.getContext("2d");

//Affichage du sol
var drawGrass = function(){
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			context.drawImage(grass, i*64, j*64);
		}
	}
};
var grass = new Image();



//Affichage du pikachu
var direction = {
	"ArrowRight": 128,
	"ArrowLeft": 64,
	"ArrowUp": 192,
	"ArrowDown": 0,
};

var marche = {
	"3": 128,
	"2": 64,
	"4": 192,
	"1": 0
};
 
var sx = marche["1"];
var sy = direction["ArrowDown"];
var x = 0;
var y = 0;
var col = 1;
var col2 = 0;
var sensX = 0;
var sensY = 0;
var enAction = false;
var tonerre = false;
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

if (grass.src = "grass.png") {
	if(pikachu.src = "pikachu.png"){
		grass.onload = drawGrass;
		pikachu.onload = drawPikachu;	
	}
}
//déplacement

document.onkeydown = function(e){
	enAction = true;
	//sy = direction[e.key];
	if (e.key==="ArrowRight") {
		//x = x + 10;
		sensX = 10; 
		sy = direction[e.key];
	}else if (e.key==="ArrowLeft") {
		//x=x-10;
		sensX = -10; 
		sy = direction[e.key];
	}else if (e.key==="ArrowUp") {
		sensY = -10; 
		sy = direction[e.key];
		//y=y-10;
	}else if (e.key==="ArrowDown") {
		sensY = 10; 
		sy = direction[e.key];
		//=y+10;
	}else if (e.key === " ") {
		tonerre = true;
/*		context.clearRect(0, 0, 500, 500);
		drawGrass();
		drawPikachu(); 
		drawEclair(); */
	}		
	/*context.clearRect(0, 0, 500, 500);
	drawGrass();
	drawPikachu();*/
};

document.onkeyup = function(e){
	enAction = false;
	sensX = 0;
	sensY = 0;
	tonerre = false;
};

setInterval(
	function(){
		if (enAction === true){
			x = x + sensX;
			y = y + sensY;
			sx = marche[col];
			col = (col + 1) % 4 +1 ;
			context.clearRect(0, 0, 500, 500);
			drawGrass();
			drawPikachu();
			if(tonerre === true){
				col2 = (col2 + 1) % 4 ;
				drawEclair();
				audio.play();
			}	
		}
	},400);