let searchBar, waitingBloc, searchInput, autoComplete, search, waitingMsg, invit, pong, ball;

function handleInputSearchEvent() {
  return function () {
    const searchTerm = searchInput.value.trim();

    autoComplete.innerHTML = "";

    if (searchTerm === "") {
      return;
    }

    document.addEventListener("click", function (event) {
      const isAutocompleteClick = autoComplete.contains(event.target);

      if (!isAutocompleteClick) autoComplete.innerHTML = "";
    });

    const propositions = ["robert", "sebastien", "pierre", "paul", "jaques"];
    propositions.forEach((proposition) => {
      const listItem = document.createElement("li");
      listItem.textContent = proposition;
      autoComplete.appendChild(listItem);

      listItem.addEventListener("click", function () {
        searchInput.value = proposition;
        autoComplete.innerHTML = "";
        search.id = proposition;
      });
    });
  };
}

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
    setTimeout(playGame, 3000);
    //Joueur pas ok
    // setTimeout(() => {
    //     oupsRejected(opponent);
    // }, 3000);
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

function setupDynamicElements() {
  console.log("Je set up");
  searchBar = document.querySelector("#search");
  waitingBloc = document.querySelector(".waiting");
  searchInput = document.querySelector("#search-input");
  autoComplete = document.querySelector(".autocomplete");
  search = document.querySelectorAll(".search");
  waitingMsg = document.querySelector(".waiting-msg");
  invit = document.querySelector(".invit-game");
  pong = document.querySelector(".pong");
  ball = document.querySelector(".wrap-ball");

  searchInput.addEventListener("input", handleInputSearchEvent());
}

document.body.addEventListener("DOMNodeInserted", function (event) {
  console.log("Nouveau noeuds");
  if (event.target.tagName === "input" && event.target.id === "search-input") {
    setupDynamicElements();
  }
});

setupDynamicElements();
