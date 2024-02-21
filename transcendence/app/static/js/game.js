const searchBar = document.querySelector("#search");
const waitingBloc = document.querySelector(".waiting");
const waitingMsg = document.querySelector(".waiting-msg");
const invit = document.querySelector(".invit-game");
const pong = document.querySelector(".pong");
const ball = document.querySelector(".wrap-ball");
const searchInput = document.querySelector("#search-input");
const autoComplete = document.querySelector(".autocomplete");
const search = document.querySelectorAll(".search");
const propositions = ['robert', 'sebastien', 'pierre', 'paul', 'jaques'];

function handleInputSearchEvent() {
    return function () {
        const searchTerm = searchInput.value.trim();

        // Efface la liste d'autocomplétion
        autoComplete.innerHTML = "";

        // Si la recherche est vide, quitte la fonction
        if (searchTerm === "") {
            return;
        }

        // Si on clique a l'exterieur de la zone d'autocomplétion -> on efface la liste
        document.addEventListener("click", function (event) {
            const isAutocompleteClick = autoComplete.contains(event.target);

            if (!isAutocompleteClick)
                autoComplete.innerHTML = "";
        });

        propositions.forEach((proposition) => {
            const listItem = document.createElement("li");
            listItem.textContent = proposition;
            autoComplete.appendChild(listItem);

            // Ajoute un gestionnaire d'événement pour sélectionner un résultat
            listItem.addEventListener("click", function () {
                searchInput.value = proposition;
                autoComplete.innerHTML = "";
                search.id = proposition;
            });
        });
    };
}

searchInput.addEventListener("input", handleInputSearchEvent());

function selectPlayer() {
    printWaiting(search.id);
    search.id = "";
    searchInput.value = "";
}

function printWaiting(opponent) {
    searchBar.classList.add("displayNone");
    waitingBloc.classList.remove("displayNone");
    waitingMsg.textContent = `En attente de la reponse de ${opponent}`;
    //Joueur ok
    // setTimeout(playGame, 3000);
    //Joueur pas ok
    setTimeout(() => {
        oupsRejected(opponent);
    }, 3000);
    //Pas de reponse du joueur
    // setTimeout(() => {
    //     oupsUnreachable(opponent);
    //   }, 3000);

}

function playGame() {
    invit.classList.add("displayNone");
    pong.classList.remove("displayNone");
    searchBar.classList.remove("displayNone");
    waitingBloc.classList.add("displayNone");
    gameLoop()
}

function oupsRejected(opponent) {
    waitingMsg.textContent = `Oups ... ${opponent} ne veux pas jouer.`;
    ball.classList.add("displayNone");
    setTimeout(function () {
        // Redirection vers la vue "dashboard"
        window.location.href = '/';
    }, 3000);
}

function oupsUnreachable(opponent) {
    waitingMsg.textContent = `Oups ... ${opponent} ne semble pas etre disponible.`;
    ball.classList.add("displayNone");
    setTimeout(returnDash, 3000);
}
