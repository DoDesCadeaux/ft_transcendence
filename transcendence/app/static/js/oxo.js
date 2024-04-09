var baseTableau;
var matchIA = false;     // Variable pour garder une trace du mode de jeu sélectionné
var player1Turn = true; // Variable pour garder une trace du tour du joueur 1 en mode deux joueurs

const oPlayer = 'O';
const xPlayer = 'X';
const aiPlayer = 'X';

const combinaisonsWin = [
    //horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //travers
    [0, 4, 8],
    [6, 4, 2]
]

var cellules, dataOxo;

startGameOxo();

function setAsyncVariablesOxo(dataMatch){
    cellules = document.querySelectorAll('.cell');
    dataOxo = dataMatch;
}

function bouttonAI()
{
    matchIA = true;
    for (var i = 0; i < cellules.length; i++) 
    {
        cellules[i].removeEventListener('click', turnClick, false);
        cellules[i].removeEventListener('click', turnClickPlayer, false);
    }
    startGameOxo();

}

function bouttonPlayer()
{
    matchIA = false;
    for (var i = 0; i < cellules.length; i++) 
    {
        cellules[i].removeEventListener('click', turnClick, false);
        cellules[i].removeEventListener('click', turnClickPlayer, false);
    }
    startGameOxo();
}

/*
    Agit comme un point d'entrée pour démarrer le jeu, en choisissant le bon type de jeu en 
    fonction du mode sélectionné par le joueur.
*/
function startGameOxo() 
{
    setAsyncVariablesOxo(null);
    if (matchIA)
        startMatchIA();
    else
        startMatchPlayer();
}

/*
    Crée un bouton de replay qui masque l'écran de fin de jeu et lance une nouvelle partie 
    lorsque le bouton est cliqué.
*/
// document.querySelector(".replay").addEventListener('click', function() {
//     document.querySelector(".endgame").style.display = "none";
//     startGameOxo();
// });

/* 
    initialise le jeu pour le mode contre l'IA en masquant l'écran de fin de jeu, 
    en réinitialisant le plateau de jeu et en ajoutant des écouteurs d'événements de clic 
    à chaque cellule pour permettre au joueur d'interagir avec le jeu.
*/
function startMatchIA() {
    // Flag mode de jeu
    matchIA = true;
    // Cache l ecran de fin de jeu
    document.querySelector(".endgame").style.display = "none";
    // init tableau de jeu vide
    baseTableau = Array.from(Array(9).keys());
    // Ajouter event litenener sur chaques cellules avec 'turnClick'
    for (var i = 0; i < cellules.length; i++) {
        cellules[i].innerText = '';
        cellules[i].style.removeProperty('background-color');
        cellules[i].addEventListener('click', turnClick, false);
    }
}

/*  
    Initialise le jeu pour le mode deux joueurs en masquant l'écran de fin de jeu, 
    en réinitialisant le plateau de jeu et en ajoutant des écouteurs d'événements de clic 
    à chaque cellule pour permettre aux joueurs d'interagir avec le jeu. 
*/
function startMatchPlayer() {
    // Flag mode de jeu
    matchIA = false;
    // Cache l ecran de fin de jeu
    document.querySelector(".endgame").style.display = "none";
    // init tableau de jeu vide
    baseTableau = Array.from(Array(9).keys());
    // Ajouter event litenener sur chaques cellules avec 'turnClickPlayer'
    for (var i = 0; i < cellules.length; i++) {
        cellules[i].innerText = '';
        cellules[i].style.removeProperty('background-color');
        cellules[i].addEventListener('click', turnClickPlayer, false);
    }
}

/*
    Gère le déroulement d'un tour de jeu pour le joueur humain, en effectuant des vérifications et 
    en faisant jouer l'IA si nécessaire.
*/
function turnClick(square) 
{
    if (typeof baseTableau[square.target.id] == 'number') 
    {
        if (checkWin(baseTableau, oPlayer) || checkWin(baseTableau, aiPlayer)) 
            return;
        if (typeof baseTableau[square.target.id] == 'number') 
        {
            tour_suivant(square.target.id, oPlayer)
            if (!checkEgalite()) tour_suivant(bestSpot(), aiPlayer);
        }
    }
}

/*
    Gère le déroulement d'un tour de jeu dans le mode deux joueurs, en alternant entre
    les joueurs et en effectuant des vérifications pour déterminer s'il y a un gagnant.
*/
function turnClickPlayer(square) {
    if (typeof baseTableau[square.target.id] == 'number') {
        // Vérifie s'il y a déjà un gagnant
        if (checkWin(baseTableau, oPlayer) || checkWin(baseTableau, xPlayer)) {
            return;
        }

        // Joue le coup du joueur en fonction du tour
        if (typeof baseTableau[square.target.id] == 'number') {
            if (player1Turn) {
                tour_suivant(square.target.id, oPlayer);
            } else {
                tour_suivant(square.target.id, xPlayer);
            }
            
            // Vérifie s'il y a un gagnant après chaque coup joué
            let gameWon = checkWin(baseTableau, player1Turn ? oPlayer : xPlayer);
            if (gameWon) {
                // Si un joueur gagne, appelle endGame() pour terminer la partie
                endGameOxo(gameWon);
                return; // Sort de la fonction pour éviter de passer au tour suivant
            }
            
            // Vérifie s'il y a une égalité après chaque coup joué
            if (!checkEgalite()) {
                // Passe au tour suivant
                player1Turn = !player1Turn;
            }
        }
    }
}

/*
    Gère la logique du jeu après qu'un joueur a joué un coup valide : 
    Elle met à jour l'état interne du jeu, met à jour l'affichage et vérifie s'il y a un gagnant.
*/
function tour_suivant(caseId, objectPlayer) 
{
    baseTableau[caseId] = objectPlayer;
    document.getElementById(caseId).innerText = objectPlayer;
    let gameWon = checkWin(baseTableau, objectPlayer);
    if (gameWon) 
        endGameOxo(gameWon)
}

/*
    Vérifie si un joueur a gagné en comparant les cellules occupées par le joueur avec les scénarios de victoire possibles.
*/
function checkWin(tableau, player) 
{
    // Check chaque cases du tableau et reprend celles joués par player
    let plays = tableau.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    // Parcours chaque combinaison de gain possible
    for (let [index, win] of combinaisonsWin.entries()) 
    {
        // Verifie pour chaque combinaison gagnante si 'plays' correspond
        if (win.every(elem => plays.indexOf(elem) > -1)) 
        {
            // renvoie variable avec le nom du joueur gaganant
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

/*
    Met en surbrillance les cases gagnantes, désactive les événements de clic pour empêcher tout mouvement 
    supplémentaire et affiche un message indiquant le résultat du jeu.
*/
function endGameOxo(gameWon) 
{
    // Applique la couleurs en fct du joueur sur les cases gagnantes 
    for (let index of combinaisonsWin[gameWon.index]) 
    {
        document.getElementById(index).style.backgroundColor = gameWon.player == oPlayer ? "blue" : "red";
    }
    // Empeche tout les event listener de case de fonctionner
    for (var i = 0; i < cellules.length; i++) 
    {
        cellules[i].removeEventListener('click', turnClick, false);
        cellules[i].removeEventListener('click', turnClickPlayer, false);
    }
    if (matchIA)
        getWinner(gameWon.player == oPlayer ? "Gagné!" : "Perdu!");
    else
        getWinner(gameWon.player == oPlayer ? "Player 1 WIN!" : "Player 2 WIN!");
    
    
}

/*
    Affiche l'écran de fin de partie et met à jour le message affiché pour indiquer le résultat du jeu.
*/
function getWinner(whoWin) 
{
    document.querySelector(".endgame").style.display = "flex";
    document.querySelector(".endgame .text").innerText = whoWin;

    setTimeout(function () {
        window.location.href = "/";
    }, 3000);
}

/*
    Permet de récupérer les indices des cases vides sur le plateau de jeu, ce qui est utile 
    pour différentes logiques de jeu, comme vérifier s'il y a une égalité ou trouver le meilleur coup à jouer.
*/
function casesVides() 
{
    return baseTableau.filter(s => typeof s == 'number');
}

/*
    Utilise l'algorithme minimax pour déterminer le meilleur coup à jouer pour l'IA, puis renvoie l'index de ce coup.
*/
function bestSpot() 
{
    return minimax(baseTableau, aiPlayer).index;
}

/*
    Vérifie s'il y a égalité dans la partie, c'est-à-dire si le plateau est rempli sans qu'aucun joueur n'ait gagné.
*/
function checkEgalite() 
{
    if (casesVides().length == 0) 
    {
        // Verifie le nombre de cases vides disponibles pour les egalités
        // Retire les events listeners
        for (var i = 0; i < cellules.length; i++) 
        {
            cellules[i].style.backgroundColor = "pink";
            cellules[i].removeEventListener('click', turnClick, false);
            cellules[i].removeEventListener('click', turnClickPlayer, false);
        }
        getWinner("Egalité")
        return true;
    }
    return false;
}

function minimax(newBoard, player) 
{
    var casesDispo = casesVides();
    if (checkWin(newBoard, oPlayer)) 
    {
        return { score: -10 };
    }
    else if (checkWin(newBoard, aiPlayer)) 
    {
        return { score: 10 };
    } 
    else if (casesDispo.length === 0) 
    {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < casesDispo.length; i++) 
    {
        var move = {};
        move.index = newBoard[casesDispo[i]];
        newBoard[casesDispo[i]] = player;
        if (player == aiPlayer) {
            var result = minimax(newBoard, oPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }
        newBoard[casesDispo[i]] = move.index;
        moves.push(move);
    }
    var meilleurMove;
    if (player === aiPlayer) 
    {
        var meilleurScore = -10000;
        for (var i = 0; i < moves.length; i++) 
        {
            if (moves[i].score > meilleurScore) 
            {
                meilleurScore = moves[i].score;
                meilleurMove = i;
            }
        }
    } 
    else 
    {
        var meilleurScore = 10000;
        for (var i = 0; i < moves.length; i++) 
        {
            if (moves[i].score < meilleurScore) 
            {
                meilleurScore = moves[i].score;
                meilleurMove = i;
            }
        }
    }
    return moves[meilleurMove];
}