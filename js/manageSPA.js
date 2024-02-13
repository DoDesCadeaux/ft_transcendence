const dash = document.querySelector(".dash");
const profile = document.querySelector(".profile");


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
    //Quid jeu en cours
    console.log("coucou")
    //Ajouter diplayNone au profil si besoin
    profile.classList.contains("displayNone") ||
        profile.classList.add("displayNone");
    //Enlever displayNone au dashboard
    !dash.classList.contains("displayNone") ||
        dash.classList.remove("displayNone");
    printInvitation(invitationRecue, 'received', recus);
    printInvitation(invitationEnvoyee, 'sent', envoyes);
}