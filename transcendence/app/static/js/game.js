let check = 0;

let searchBar, waitingBloc, searchInput, autoComplete, search, waitingMsg, invit, pong, ball;


function handleInputSearchEvent(users) {
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

    if (users.length == 0) {
      const listItem = document.createElement("li");
      listItem.textContent = "Aucun joueur n'est disponible, tente ta chance plus tard !";
      autoComplete.appendChild(listItem);
    }
    
    const btn_search = document.querySelector('#search .bar .search')

    users.forEach((user) => {
      if (user.state == "online") {
        const listItem = document.createElement("li");
        listItem.textContent = user.username;
        autoComplete.appendChild(listItem);

        listItem.addEventListener("click", function () {
          if (btn_search.className.includes('notAllowed')){
            btn_search.classList.remove('notAllowed');
            btn_search.classList.add('pointer');
          }
          searchInput.value = user.username;
          autoComplete.innerHTML = "";
          search.id = user.username;
        });
      }
    });
  };
}

function selectPlayer() {
  const btn_search = document.querySelector('#search .bar .search')
  if (btn_search.className.includes("pointer")){
    printWaiting(search.id);
    search.id = "";
    searchInput.value = "";
  }
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
  gameLoop();
}

function oupsRejected(opponent) {
  waitingMsg.textContent = `Oups ... ${opponent} ne veux pas jouer.`;
  ball.classList.add("displayNone");
  setTimeout(function () {
    // Redirection vers la vue "dashboard"
    window.location.href = "/";
  }, 3000);
}

function oupsUnreachable(opponent) {
  waitingMsg.textContent = `Oups ... ${opponent} ne semble pas etre disponible.`;
  ball.classList.add("displayNone");
  setTimeout(returnDash, 3000);
}

function setupDynamicElements() {
  searchBar = document.querySelector("#search");
  waitingBloc = document.querySelector(".waiting");
  searchInput = document.querySelector("#search-input");
  autoComplete = document.querySelector(".autocomplete");
  search = document.querySelectorAll(".search");
  waitingMsg = document.querySelector(".waiting-msg");
  invit = document.querySelector(".invit-game");
  pong = document.querySelector(".pong");
  ball = document.querySelector(".wrap-ball");

  (async () => {
  	const dataUsers = await fetchGET(URI.USERS);
    const usersOnline =  dataUsers.users.filter(user => user.state !== "offline" && user.state !== "in-game");
    searchInput.addEventListener("input", handleInputSearchEvent(usersOnline));
  })();
}

document.body.addEventListener("DOMNodeInserted", function (event) {
  if (document.querySelector("#search-input") && check == 0){
    setupDynamicElements();
    check +=1;
  }
  if (!document.querySelector("#search-input"))
    check = 0;
});




