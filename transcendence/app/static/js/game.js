let check = 0;

let searchBar,
  waitingBloc,
  searchInput,
  autoComplete,
  search,
  waitingMsg,
  invit,
  pong,
  oxoGame,
  ball;



function handleInputSearchEvent(connectedUser, users, searchInputT, autoCompleteT, searchT, btn_searchT) {
  return function () {
    const searchTerm = searchInputT.value.trim();

    autoCompleteT.innerHTML = "";

    if (searchTerm === "") {
      return;
    }

    document.addEventListener("click", function (event) {
      const isAutocompleteClick = autoCompleteT.contains(event.target);

      if (!isAutocompleteClick) autoCompleteT.innerHTML = "";
    });

    if (users.length == 0) {
      const listItem = document.createElement("li");
      listItem.textContent =
        "Aucun joueur n'est disponible, tente ta chance plus tard !";
      autoCompleteT.appendChild(listItem);
    }

    users.forEach((user) => {
      if (user.state == "online" && user.id != connectedUser.id) {
        const listItem = document.createElement("li");
        listItem.textContent = user.username;
        autoCompleteT.appendChild(listItem);

        listItem.addEventListener("click", function () {
          if (btn_searchT.className.includes("notAllowed")) {
            btn_searchT.classList.remove("notAllowed");
            btn_searchT.classList.add("pointer");
          }
          searchInputT.value = user.username;
          autoCompleteT.innerHTML = "";
          searchT.id = user.username;
        });
      }
    });
  };
}

function selectPlayer() {
  const pong_btn_search = document.querySelector(".Pong #search .bar .search");
  if (pong_btn_search.className.includes("pointer")) {
    sentNotification(search[0].id, null, 0)
    search[0].id = "";
    searchInput[0].value = "";
  }
  const oxo_btn_search = document.querySelector(".Oxo #search .bar .search");
  if (oxo_btn_search.className.includes("pointer")) {
    sentNotification(search[1].id, null, 1)
    search[1].id = "";
    searchInput[1].value = "";
  }
}

function printWaiting(opponent, notifId, tournament_id) {
  const pong = document.querySelector(".Pong");
  const oxo = document.querySelector(".Oxo");
  pong.classList.add("displayNone");
  oxo.classList.add("displayNone");

  waitingBloc.classList.remove("displayNone");
  waitingMsg.textContent = `En attente de la reponse de ${opponent}`;

  const interval = setInterval(() => {
    fetch(`http://localhost:8000/api/checkNotif/sent/?id=${notifId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.state != 0) {
          clearInterval(interval); // Arrêter l'intervalle une fois que l'état n'est plus 0
          if (data.state == 1){
            if (data.game == 0)
              playGame(opponent, tournament_id, "pong");
            else
              playGame(opponent, tournament_id, "oxo");
          } 
          else if (data.state == 2) oupsRejected(opponent);
          else oupsUnreachable(opponent);
        }
      })
      .catch((error) => console.error("Erreur :", error));
  }, 2000);

  setTimeout(() => {
    closeAndUpdate(3, notifId);
  }, 6000); // 6 secondes
}

function playGame(opponent, tournament_id, game) {
  //Mettre a jour les photos
  const photos = document.querySelectorAll(".opponents-img");
  const opponents = document.querySelector(".opponents");
  const formData = new FormData();
  formData.append("opponent", opponent);
  opponents.classList.remove("displayNone")
  if (game == "pong"){
    if (tournament_id)
      formData.append("tournament", tournament_id);
    fetch(`/api/match/create/`, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        photos[0].src = data.player1.photo;
        photos[1].src = data.player2.photo;
        setAsyncVariables(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la création du tournoi :", error);
        contentNotification.textContent = `La création du match a échouée`;
      });

      pong.classList.remove("displayNone");
      gameLoop();
  }
  else {
    fetch(`/api/oxo/create/`, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        photos[0].src = data.player1.photo;
        photos[1].src = data.player2.photo;
        setAsyncVariablesOxo(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la création du tournoi :", error);
        contentNotification.textContent = `La création du match a échouée`;
      });
      oxoGame.classList.remove("displayNone");
      // startGameOxo();
  }

  invit.classList.add("displayNone");
  waitingBloc.classList.add("displayNone");

}

function oupsRejected(opponent) {
  waitingMsg.textContent = `Oups ... ${opponent} ne veux pas jouer.`;
  ball.classList.add("displayNone");
  setTimeout(function () {
    window.location.href = "/";
  }, 3000);
}

function oupsUnreachable(opponent) {
  waitingMsg.textContent = `Oups ... ${opponent} ne semble pas etre disponible.`;
  ball.classList.add("displayNone");
  setTimeout(function () {
    window.location.href = "/";
  }, 3000);
}

function setupDynamicElements() {
  searchBar = document.querySelectorAll("#search");
  waitingBloc = document.querySelector(".waiting");
  searchInput = document.querySelectorAll("#search-input");
  autoComplete = document.querySelectorAll(".autocomplete");
  search = document.querySelectorAll(".search");
  waitingMsg = document.querySelector(".waiting-msg");
  invit = document.querySelector(".invit-game");
  pong = document.querySelector("#pongCanvas");
  ball = document.querySelector(".wrap-ball");
  oxoGame = document.querySelector(".game-container");

  (async () => {
    const dataUsers = await fetchGET(URI.USERS);
    const connectedUser = await fetchGET(URI.USER);
    const usersOnline = dataUsers.filter(
      (user) => user.state !== "offline" && user.state !== "in-game"
    );
    const btn_search = document.querySelectorAll("#search .bar .search");
    searchInput.forEach(function(input, index) {
      input.addEventListener(
        "input",
        handleInputSearchEvent(
          connectedUser,
          usersOnline,
          searchInput[index],
          autoComplete[index],
          search[index],
          btn_search[index]
        )
      );
    });
    
  })();

}

let is_tournament_ID = null;
let is_tournament_notifID = null;
let is_tournament_opponent = null;


document.body.addEventListener("DOMNodeInserted", function (event) {
  if (document.querySelector("#search-input") && check == 0) {
    setupDynamicElements();
    check += 1;
    const is_tournament = localStorage.getItem('data_tournament');
    if (is_tournament){
      const tournamentObject = JSON.parse(is_tournament);
      printWaiting(tournamentObject.opponent, tournamentObject.notification_id, tournamentObject.tournament_id);
      localStorage.removeItem('data_tournament');
    }
  }
  if (!document.querySelector("#search-input")){ check = 0; }
});

function sentNotification(player2, tournament_id, type) {
  const formData = new FormData();
  const opponent = player2;
  formData.append("opponent", opponent);
  formData.append("type", type);

  fetch(`/api/notif/create/`, {
    method: "POST",
    body: formData,
    headers: {
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const notificationId = data.notification_id;
      if (tournament_id){
        const data_tournament = {
          "tournament_id" : tournament_id,
          "opponent" : opponent,
          "notification_id" : notificationId,
        };
        const objetJSONdataT = JSON.stringify(data_tournament);
        localStorage.setItem('data_tournament', objetJSONdataT);
        window.location.href = "/game";
      }
      else{
        printWaiting(opponent, notificationId, tournament_id);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la création de la notif :", error);
    });
}

function playVScomputer(){
  const pong = document.querySelector(".Pong");
  const oxo = document.querySelector(".Oxo");
  pong.classList.add("displayNone");
  oxo.classList.add("displayNone");

  playGame("IA", null, "oxo");
}
