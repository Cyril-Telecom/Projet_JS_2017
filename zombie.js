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
		this.positionY = this.positionY + 5 * this.speed;
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