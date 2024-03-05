// const dash = document.querySelector(".dash");
// const profile = document.querySelector(".profile");
// const game = document.querySelector(".game");


// function openProfile() {
//     //Bloquer si jeu en cours

//     //Ajouter diplayNone dashboard si besoin
//     dash.classList.contains("displayNone") ||
//         dash.classList.add("displayNone");
//     //Enlever displayNone a profil
//     !profile.classList.contains("displayNone") ||
//         profile.classList.remove("displayNone");
// }

// function openDash() {
//     //Ajouter diplayNone au profil si besoin
//     profile.classList.contains("displayNone") ||
//         profile.classList.add("displayNone");
//     //Enlever displayNone au dashboard
//     !dash.classList.contains("displayNone") ||
//         dash.classList.remove("displayNone");
//     // printInvitation(invitationRecue, 'received', recus);
//     // printInvitation(invitationEnvoyee, 'sent', envoyes);
// }

// function newGame() {
//     dash.classList.add("displayNone");
//     game.classList.remove("displayNone");
// }

// function returnDash() {
//     game.classList.contains("displayNone") ||
//         game.classList.add("displayNone");
//     !dash.classList.contains("displayNone") ||
//         dash.classList.remove("displayNone");
//     ball.classList.remove("displayNone");
//     searchBar.classList.remove("displayNone");
//     waitingBloc.classList.add("displayNone");
// }
console.log("bonjour");

document.addEventListener('DOMContentLoaded', function() {
    const app = document.querySelector('.content'); // Sélectionnez l'élément .content
    console.log("coucou")
    function loadPage(uri) {
        console.log("requete ajax")
        // Effectuez une requête AJAX pour charger les données depuis Django en fonction de l'URI
        fetch(uri)
            .then(response => response.text())
            .then(data => {
                app.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading page:', error);
            });
    }

    function handleNavigationClick(event) {
        const isNavLink = event.target.classList.contains('nav-link');
        if (isNavLink) {
            event.preventDefault();
            const uri = event.target.getAttribute('href');
            console.log(uri);
            loadPage(uri);
            history.pushState(null, null, uri);
        }
    }

    document.addEventListener('click', handleNavigationClick);

    function handlePopState(event) {
        const uri = window.location.pathname;
        loadPage(uri);
    }

    window.addEventListener('popstate', handlePopState);

    // Charger la première page lors du chargement initial
    var initialURI = window.location.pathname;
    initialURI += "/dashboard";
    loadPage(initialURI);
});
