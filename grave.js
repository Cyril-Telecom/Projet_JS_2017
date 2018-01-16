/**
*	Classe qui définie les tombes des zombies 
*	
**/

class Grave {
	constructor(n, m, e, f, temps){
		//paramètres de l'image
		this.sx = e * 80;
		this.sy = f * 121;
		this.swidth = 80;
		this.sheight = 121;
		this.positionX = n;
		this.positionY = m;
		this.width = 32;
		this.height = 48;
		this.time = temps;//instant au quel est apparu la tombe
	}

	/*ajoute un objet tombe à tabGraves*/
	add(){
		tabGraves.push(this);
	}

	/*retourne l'instant au quel est apparu la tombe*/
	getTime(){return this.time;}

	/*Dessine la tombe*/
	draw(){
		context.drawImage(graveImage, this.sx, this.sy, this.swidth, this.sheight, this.positionX, this.positionY, this.width, this.height);
	}
}