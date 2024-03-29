let check = 0;

let searchBar,
  waitingBloc,
  searchInput,
  autoComplete,
  search,
  waitingMsg,
  invit,
  pong,
  ball;



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
      listItem.textContent =
        "Aucun joueur n'est disponible, tente ta chance plus tard !";
      autoComplete.appendChild(listItem);
    }

    const btn_search = document.querySelector("#search .bar .search");

    users.forEach((user) => {
      if (user.state == "online") {
        const listItem = document.createElement("li");
        listItem.textContent = user.username;
        autoComplete.appendChild(listItem);

        listItem.addEventListener("click", function () {
          if (btn_search.className.includes("notAllowed")) {
            btn_search.classList.remove("notAllowed");
            btn_search.classList.add("pointer");
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
  const btn_search = document.querySelector("#search .bar .search");
  if (btn_search.className.includes("pointer")) {
    sentNotification(search.id, null)
    search.id = "";
    searchInput.value = "";
  }
}

function printWaiting(opponent, notifId, tournament_id) {
  searchBar.classList.add("displayNone");
  waitingBloc.classList.remove("displayNone");
  waitingMsg.textContent = `En attente de la reponse de ${opponent}`;

  const interval = setInterval(() => {
    fetch(`http://localhost:8000/api/checkNotif/sent/?id=${notifId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data[0] != 0) {
          clearInterval(interval); // Arrêter l'intervalle une fois que l'état n'est plus 0
          console.log("L'état de la notification est :", data[0]);
          if (data[0] == 1) playPong(opponent, tournament_id);
          else if (data[0] == 2) oupsRejected(opponent);
          else oupsUnreachable(opponent);
        }
      })
      .catch((error) => console.error("Erreur :", error));
  }, 2000);

  setTimeout(() => {
    closeAndUpdate(3, notifId);
  }, 6000); // 6 secondes
}

function playPong(opponent, tournament_id) {
  //Mettre a jour les photos
  const photos = document.querySelectorAll(".opponents-img");
  console.log(photos);
  const formData = new FormData();
  formData.append("opponent", opponent);
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
      console.log(data);
      photos[0].src = data.player1.photo;
      photos[1].src = data.player2.photo;
      setAsyncVariables(data);
    })
    .catch((error) => {
      console.error("Erreur lors de la création du tournoi :", error);
      contentNotification.textContent = `La création du tournoi a échouée`;
    });

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
    const usersOnline = dataUsers.users.filter(
      (user) => user.state !== "offline" && user.state !== "in-game"
    );
    searchInput.addEventListener("input", handleInputSearchEvent(usersOnline));
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

function sentNotification(player2, tournament_id) {
  const formData = new FormData();
  const opponent = player2;
  formData.append("opponent", opponent);
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
