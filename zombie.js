/**
*	Classe qui définie les Zombies du jeu
*	4 sortes de zombie (faible, moyen, fort, Boss)
**/

class Zombie {
	constructor(n, m, c, d){
		//Paramètres de l'image
		this.sx = d * 96;//abscisse du zombie dans l'image d'origine
		this.sy = c * 128;//ordonée du zombie dans l'image d'origine
		this.swidth = 32;//largeur du zombie sur l'image d'origine
		this.sheight = 32;//hauteur du zombie sur l'image d'origine
		this.positionX = n;//abscisse du zombie à afficher
		this.positionY = m;//ordonnée du zombie à afficher
		this.width = 32;//largeur de l'image du zombie à afficher
		this.height = 32;//hauteur de l'image du zombie à afficher
		this.image = zombieImage;//image sprite utilisé pour afficher le zombie. Il alterne entre normal et rouge quand il est touché.
		//Ces 2 variables servent à mémoriser quel est le type de zombie. Elles sont utilisées pour l'affichage du zombie
		this.colonne = d * 96;
		this.ligne = c * 128;
		//sens de déplacement de l'image du zombie (1=vers la droite, -1=vers la gauche)
		this.sensDisplayImage = 1;

		//Définittion des PV, de la taille et de l'allure
		if (d === 0){//zombie faible
			this.HP = 1;
			this.maxHP = 1;
			this.point = 1;
			this.speed = 1;//rapide
		} else if (d === 1){// zombie moyen
			this.HP = 2;
			this.maxHP = 2;
			this.point = 3;
			this.speed = 0.6;//lent
			if (c === 1){//le boss
				this.HP = 25;
				this.maxHP = 25;
				this.point = 30;
				this.speed = 0.4;//très lent
				this.width = 1.5*this.width;
				this.height = 1.5*this.height;
			}
		} else if(d === 3){//zombie fort
			this.HP = 3;
			this.maxHP = 3;
			this.point = 5;
			this.speed = 0.8;//modéré
		}
	}

/*	ajoute un zombie à tabZombies*/
	add(){tabZombies.push(this);}

/*	Affichage des zombies et de leur barre de vie
	chaque zombie fait 32x32*/
	draw(){
		context.drawImage(this.image, this.sx, this.sy, this.swidth, this.sheight, this.positionX, this.positionY, this.width, this.height);
		//choix de la couleur de la barre de vie
		if (this.HP === this.maxHP) {
			context.fillStyle = "#00FF00";//vert
		}else if (this.HP > (this.maxHP)/2){
			context.fillStyle = "#FF9900";//orange
		}else if (this.HP <= (this.maxHP)/2){
			context.fillStyle = "#FF0000";//rouge
		}
		//Affichage de la barre de vie
		context.fillRect(this.positionX, this.positionY - 5, this.width * this.HP / this.maxHP, 1);
	}

	/*Déplace les zombies et modifie leur image*/
	move(){
		//Changement d'image du pas
		this.sx = (this.sx + this.swidth * this.sensDisplayImage) % 96 + this.colonne;
		if (this.sx === this.colonne || this.sx === this.colonne + 2 * this.swidth) {
			this.sensDisplayImage *= -1;
		}
		//déplacmeent de l'image
		this.positionY = this.positionY + 10 * this.speed;
	}

	/*retourne vrai si le curseur est bien dans le carré de l'image du zombie*/
	isHere(x, y){
		if ((this.positionX < x) && (x < this.positionX + this.width) && (this.positionY < y) && (y < this.positionY + this.height)) {
			return true;
		}
		return false;
	}

	/*Fait perdre un point de vie au zombie*/
	loseHP(){
		this.HP--;
		this.image = zombieImageRed;
	}

	/*retourne les points de vie du zombie*/
	getHP(){return this.HP;}

	/*Retourne vrai si le zombie a atteint le bas de al carte*/
	isBot(){
		if (this.positionY > 800 - this.height) return true;
		return false;
	}

	/*retourne le nombre de points que rapporte le zombie*/
	getPoint(){return this.point;}

	/*modifie l'image utilisée. Ca sert notamment à l'afficher en rouge ou non*/
	setImage(img){this.image = img;}

	/*retourne l'image utilisée*/
	getImage(){return this.image;}
}