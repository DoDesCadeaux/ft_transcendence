const dash = document.querySelector(".dash");
const profile = document.querySelector(".profile");
const game = document.querySelector(".game");


function openProfile() {
    //Bloquer si jeu en cours

    //Ajouter diplayNone dashboard si besoin
    dash.classList.contains("displayNone") ||
        dash.classList.add("displayNone");
    //Enlever displayNone a profil
    !profile.classList.contains("displayNone") ||
        profile.classList.remove("displayNone");
}

function openDash() {
    //Ajouter diplayNone au profil si besoin
    profile.classList.contains("displayNone") ||
        profile.classList.add("displayNone");
    //Enlever displayNone au dashboard
    !dash.classList.contains("displayNone") ||
        dash.classList.remove("displayNone");
    // printInvitation(invitationRecue, 'received', recus);
    // printInvitation(invitationEnvoyee, 'sent', envoyes);
}

function newGame() {
    dash.classList.add("displayNone");
    game.classList.remove("displayNone");
}

function returnDash() {
    game.classList.contains("displayNone") ||
        game.classList.add("displayNone");
    !dash.classList.contains("displayNone") ||
        dash.classList.remove("displayNone");
    ball.classList.remove("displayNone");
    searchBar.classList.remove("displayNone");
    waitingBloc.classList.add("displayNone");
}