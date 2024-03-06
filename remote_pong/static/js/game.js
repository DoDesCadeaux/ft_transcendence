const searchBar = document.querySelector("#search");
const waitingBloc = document.querySelector(".waiting");
const waitingMsg = document.querySelector(".waiting-msg");
const invit = document.querySelector(".invit-game");
const pong = document.querySelector(".pong");
const ball = document.querySelector(".wrap-ball");


function selectPlayer() {
    printWaiting(search.id);
    search.id = "";
    searchInput.value = "";
}

function printWaiting(opponent){
    searchBar.classList.add("displayNone");
    waitingBloc.classList.remove("displayNone");
    waitingMsg.textContent = `En attente de la reponse de ${opponent}`;
    //Joueur ok
    setTimeout(playGame, 3000);
    //Joueur pas ok
    // setTimeout(() => {
    //     oupsRejected(opponent);
    //   }, 3000);
    //Pas de reponse du joueur
    // setTimeout(() => {
    //     oupsUnreachable(opponent);
    //   }, 3000);

}

function playGame(){
    invit.classList.add("displayNone");
    pong.classList.remove("displayNone");
    searchBar.classList.remove("displayNone");
    waitingBloc.classList.add("displayNone");
    gameLoop()
}

function oupsRejected(opponent){
    waitingMsg.textContent = `Oups ... ${opponent} ne veux pas jouer.`;
    ball.classList.add("displayNone");
    setTimeout(returnDash, 3000);
}

function oupsUnreachable(opponent){
    waitingMsg.textContent = `Oups ... ${opponent} ne semble pas etre disponible.`;
    ball.classList.add("displayNone");
    setTimeout(returnDash, 3000);
}

