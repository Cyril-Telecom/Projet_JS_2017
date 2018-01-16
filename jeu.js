/**
*	Classe qui initialise le temps de jeu, les points de vie du joueur et les points de victoire
*
**/
class Jeu {
	constructor(){
		this.pointsVictoire = 0;
		this.tempsJeu = 0;
		this.pointDeVie = 10;
	}

	addPointDeVie(n){this.pointDeVie += n;}
	getpointDeVie(){return this.pointDeVie;}

	setTempsJeu(x){this.tempsJeu = x;}
	getTempsJeu(){return this.tempsJeu;}

	setPointsVictoire(x){this.pointsVictoire += x;}
	getPointsVictoire(){return this.pointsVictoire;}
}