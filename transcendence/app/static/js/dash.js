/****************************************************************************
 * GESTION VIGNETTES DASHBOARD LINK DB
 *
 * Récuperation dans la db du raton matchs + tournois joués/gagnés
 ***************************************************************************/
let globalStatMatch = null;
let dash = false;

document.body.addEventListener("DOMNodeInserted", function (event) {
  if (document.querySelector("#glabalStatMatch") && !globalStatMatch) {
    globalStatMatch = document.querySelector("#glabalStatMatch");
    dash = true;
    (async () => {
      const data = await fetchGET(URI.MATCEHSWON);
      var msg =
        data.total == 0
          ? "Zéro match a ton actif"
          : data.won > 1
          ? `${data.won} sur ${data.total} de gagnés`
          : `${data.won} sur ${data.total} de gagné`;
      globalStatMatch.textContent = msg;
    })();
    globalStatTournament = document.querySelector("#glabalStatTournament");
    (async () => {
      const data = await fetchGET(URI.TOURNAMENTWON);
      var msg =
        data.total == 0
          ? "Zéro tournoi a ton actif"
          : data.won > 1
          ? `${data.won} sur ${data.total} de gagnés`
          : `${data.won} sur ${data.total} de gagné`;
      globalStatTournament.textContent = msg;
    })();
  }
  if (!document.querySelector("#glabalStatMatch")) {
    globalStatMatch = null;
    dash = false;
  }
});
/****************************************************************************
 * FIN GESTION VIGNETTES DASHBOARD LINK DB
 ***************************************************************************/

/****************************************************************************
 * GESTION TOURNOIS
 *
 * - affichage des tournois + fonctions annexes de setup
 ***************************************************************************/
var tournament = null;

// Set up des boutons de naviguation
const prevButton = document.createElement("button");
setupBtnNav(prevButton, "prev", "&#10096");
const nextButton = document.createElement("button");
setupBtnNav(nextButton, "next", "&#10097");

document.body.addEventListener("DOMNodeInserted", function (event) {
  if (document.querySelector(".include-tournament") && !tournament) {
    tournament = document.querySelector(".include-tournament");

    (async () => {
      const dataTournament = await fetchGET(URI.DATA_TOURNAMENT);
      console.log(dataTournament);
      if (dataTournament.length < 1) {
        const empty = document.createElement("p");
        empty.classList.add("no-tournament");
        empty.textContent =
          "Il n'y a aucun tournois, tu peux en toujours en créer un nouveau si tu le souhaites en appuyant sur le bouton plus.";
        tournament.appendChild(empty);
        return;
      }
      tournament.appendChild(prevButton);
      tournament.appendChild(nextButton);
      dataTournament.forEach((element, i) => {
        fetch("tournament_fragment/")
          .then((response) => response.text())
          .then((data) => {
            let li = document.createElement("li");
            setLi(li, data, element, i);
            tournament.appendChild(li);

            const name = li.querySelector(".tournament-name");
            setName(name, element);

            let players = li.querySelectorAll(".players-tournament");
            setPhoto(players, element.players);

            let winners = li.querySelectorAll(".winner-tournament");
            setPhoto(winners, element.winners);

            let btnGo = li.querySelectorAll(".btn-gomatch");
            displayGoBtn(btnGo, element);

            manageGoBtn(btnGo, element);
          })
          .catch((error) => {
            console.error("Error loading page:", error);
          });
      });
      manageSlide();
    })();
  }
  if (!document.querySelector(".include-tournament")) tournament = null;
});

function setupBtnNav(btn, role, icon) {
  btn.classList.add("btn");
  btn.id = role;
  btn.innerHTML = icon;
}

function setLi(li, data, element, i) {
  li.innerHTML = data;
  li.id = element.id;
  classes =
    i == 0 ? li.classList.add("slide", "active") : li.classList.add("slide");
}

function setName(name, element) {
  name.textContent = decodeURIComponent(element.name);
  const joinDiv = document.createElement("div");
  joinDiv.classList.add("join");
  joinDiv.textContent = "Rejoindre";
  joinDiv.addEventListener("click", function (event) {
    joinTournament(event);
  });
  name.appendChild(joinDiv);
}

function setPhoto(elements, data) {
  elements.forEach((element, index) => {
    const photo = data[index] ? data[index].photo : "media/img/anonymous.png";
    element.setAttribute("xlink:href", photo);
  });
}

function isSubscribeTo(list) {
  return list.some((player) => player.id == CURRENT_USER.id);
}

function displayGoBtn(btnGo, element) {
  if (
    isSubscribeTo(element.players) == false ||
    element.winners.every((element) => element !== null)
  )
    btnGo.forEach((button) => (button.style.display = "none"));
  else {
    if (element.players.length != 4)
      btnGo.forEach((button) => (button.style.display = "none"));
    else {
      // Y a les 4 joueurs
      if (element.winners[2] || !element.winners[0] || !element.winners[1])
        btnGo[2].style.display = "none";
      if (isSubscribeTo(element.players.slice(0, 2))) {
        btnGo[1].style.display = "none";
        if (element.winners[0]) btnGo[0].style.display = "none";
      } else if (!isSubscribeTo(element.players.slice(0, 2))) {
        btnGo[0].style.display = "none";
        if (element.winners[1]) btnGo[1].style.display = "none";
      }
    }
  }
}

function manageGoBtn(btnGo, element) {
  console.log(CURRENT_USER); // Je peux recup le current USER. ReCommencer la logique ici.
  if (btnGo[0].style.display != "none" && element.players[1]) {
    btnGo[0].style.cursor = "pointer";
    var invitedPlayer =
      CURRENT_USER.username == element.players[1].username
        ? element.players[0].username
        : element.players[1].username;
    btnGo[0].onclick = () => sentNotification(invitedPlayer, element.id, 0);
  }
  if (btnGo[1].style.display != "none" && element.players[3]) {
    btnGo[1].style.cursor = "pointer";
    var invitedPlayer =
      CURRENT_USER.username == element.players[3].username
        ? element.players[2].username
        : element.players[3].username;
    // btnGo[1].onclick = () => sentNotification(element.players[3].username, element.id, 0)
    btnGo[1].onclick = () => sentNotification(invitedPlayer, element.id, 0);
  }
  if (btnGo[2].style.display != "none") {
    btnGo[2].style.cursor = "pointer";
    var invitedPlayer =
      CURRENT_USER.username == element.winners[1].username
        ? element.winners[0].username
        : element.winners[1].username;
    // btnGo[2].onclick = () => sentNotification(element.winners[1].username, element.id, 0)
    btnGo[2].onclick = () => sentNotification(invitedPlayer, element.id, 0);
  }
}

function manageSlide() {
  const buttons = document.querySelectorAll(".btn");
  setTimeout(function () {
    const slides = document.querySelectorAll(".slide");
    if (slides.length > 1) {
      buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const calcNextSlide = e.target.id === "next" ? 1 : -1;
          const slideActive = document.querySelector(".active");

          newIndex = calcNextSlide + [...slides].indexOf(slideActive);

          if (newIndex < 0) newIndex = [...slides].length - 1;
          if (newIndex >= [...slides].length) newIndex = 0;
          slides[newIndex].classList.add("active");
          slideActive.classList.remove("active");
        });
      });
    }
  }, 1000);
}

/****************************************************************************
 * FIN GESTION TOURNOIS
 ***************************************************************************/
/****************************************************************************
 * REJOINDRE UN TOURNOI
 *
 * Action du bouton "rejoindre" avec appel a la db pour verifier si'il reste
 * de la place + modale de notification
 ***************************************************************************/
function joinTournament(e) {
  const msg = document.createElement("p");
  msg.textContent =
    "Tu es en train de rejoindre un tournois, choisi ton surnom pour ce tournoi !";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Surnom";
  input.style.backgroundColor = "transparent";
  input.style.border = "none"; // Supprimer la bordure
  input.style.outline = "none";

  const warning = document.createElement("span");
  warning.textContent = "*** Tu dois remplir tous les champ ***";
  warning.style.color = "#2c2a42";
  warning.style.display = "none";

  const validation = document.createElement("div");
  validation.className = "join";
  validation.textContent = "Valider";
  validation.style.background = "#a5a5af";
  validation.style.width = "50px";
  validation.style.padding = "3px";
  validation.style.margin = "20px";
  validation.style.borderRadius = "5px";
  validation.style.cursor = "pointer";
  validation.onclick = function () {
    handleJoinTournament(input, warning);
  };

  contentNotification.appendChild(msg);
  contentNotification.appendChild(input);
  contentNotification.appendChild(warning);
  contentNotification.appendChild(validation);

  modal.style.display = "block";

  // const id = document.querySelector(".active").id;
  // const formData = new FormData();
  // formData.append("id", id);
  // fetch(`/api/tournament/join/`, {
  //     method: "POST",
  //     body: formData,
  //     headers: {
  //         "X-CSRFToken": csrftoken,
  //     },
  // })
  //     .then((response) => {
  //         return response.text();
  //     })
  //     .then((data) => {
  //         contentNotification.textContent = decodeURIComponent(JSON.parse(data));
  //     });
  // modal.style.display = "block";
}

function handleJoinTournament(input, warning) {
  if (!input.value) {
    warning.style.display = "";
  } else {
    contentNotification.innerHTML = "";
    const formData = new FormData();
    const username = encodeURIComponent(input.value);
    const id = document.querySelector(".active").id;
    formData.append("username", username);
    formData.append("id", id);
    fetch(`/api/tournament/join/`, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        contentNotification.textContent = decodeURIComponent(JSON.parse(data));
      });
  }
}
/****************************************************************************
 * FIN REJOINDRE UN TOURNOI
 ***************************************************************************/

/****************************************************************************
 * NOUVEAU TOURNOIS
 *
 * Action du bouton "+" qui créé un nouveau tournois dans la db et les 4
 * tournament_player dont un avec son id
 ***************************************************************************/
function createTournament() {
  const msg = document.createElement("p");
  msg.textContent =
    "Tu es en train de créer un nouveau tournoi, donne lui un nom !";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nom du tournoi";
  input.style.backgroundColor = "transparent";
  input.style.border = "none"; // Supprimer la bordure
  input.style.outline = "none";

  const inputUsername = document.createElement("input");
  inputUsername.type = "text";
  inputUsername.placeholder = "Choisi ton surnom pour ce tournoi";
  inputUsername.style.backgroundColor = "transparent";
  inputUsername.style.border = "none"; // Supprimer la bordure
  inputUsername.style.outline = "none";

  const warning = document.createElement("span");
  warning.textContent = "*** Tu dois remplir tous les champ ***";
  warning.style.color = "#2c2a42";
  warning.style.display = "none";

  const validation = document.createElement("div");
  validation.className = "join";
  validation.textContent = "Valider";
  validation.style.background = "#a5a5af";
  validation.style.width = "50px";
  validation.style.padding = "3px";
  validation.style.margin = "20px";
  validation.style.borderRadius = "5px";
  validation.style.cursor = "pointer";
  validation.onclick = function () {
    handleCreateTournament(input, warning, inputUsername);
  };

  contentNotification.appendChild(msg);
  contentNotification.appendChild(input);
  contentNotification.appendChild(inputUsername);
  contentNotification.appendChild(warning);
  contentNotification.appendChild(validation);

  modal.style.display = "block";
}

function handleCreateTournament(input, warning, inputUsername) {
  if (!input.value || !inputUsername.value) {
    warning.style.display = "";
  } else {
    contentNotification.innerHTML = "";
    const formData = new FormData();
    const name = encodeURIComponent(input.value);
    const username = encodeURIComponent(inputUsername.value);
    formData.append("name", name);
    formData.append("username", username);
    fetch(`/api/tournament/create/`, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        response.json();
        nameClear = decodeURIComponent(name);
        contentNotification.textContent = `Le tournoi ${nameClear} a bien été créé !`;
      })
      .catch((error) => {
        console.error("Erreur lors de la création du tournoi :", error);
        contentNotification.textContent = `La création du tournoi a échouée`;
      });
  }
}

/****************************************************************************
 * FIN NOUVEAU TOURNOIS
 ***************************************************************************/

/****************************************************************************
 * Graph stats
 *
 * Contenu
 ***************************************************************************/
let advencedStats = null;
const radialCharts = [];
const barCharts = [];
const toggleList = [CURRENT_USER.id];

document.body.addEventListener("DOMNodeInserted", function (event) {
  if (document.querySelector(".advencedStats") && !advencedStats) {
    advencedStats = document.querySelector(".advencedStats");

    fillParams();

    const chartButs = new ApexCharts(
      document.querySelector(".stats_buts"),
      optionsColumnChart
    );
    chartButs.render();
    barCharts.push(chartButs);

    const chartPercentwon = new ApexCharts(
      document.querySelector(".stats_percent_match_won"),
      optionsRadialBar
    );
    chartPercentwon.render();
    radialCharts.push(chartPercentwon);

    const chartDemiWon = new ApexCharts(
      document.querySelector(".stats_demi_won"),
      optionsRadialBar
    );
    chartDemiWon.render();
    radialCharts.push(chartDemiWon);

    const chartFinalWon = new ApexCharts(
      document.querySelector(".stats_final_won"),
      optionsRadialBar
    );
    chartFinalWon.render();
    radialCharts.push(chartFinalWon);

    const chartDuration = new ApexCharts(
      document.querySelector(".stats_duration"),
      optionsBarChart
    );
    chartDuration.render();
    barCharts.push(chartDuration);

    getAndUpdateData();
    const statsPannel = document.querySelector(".advencedStats");
    const hystoricPannel = document.querySelector(".historic-game");
    const statsBtn = document.querySelector(".btn-satistics");
    const hystoricBtn = document.querySelector(".btn-hystoric");
    statsBtn.addEventListener("click", () => {
      statsPannel.classList.remove("displayNone");
      hystoricPannel.classList.add("displayNone");
    });
    hystoricBtn.addEventListener("click", () => {
      statsPannel.classList.add("displayNone");
      fillDataHistoric();
      hystoricPannel.classList.remove("displayNone");
    });
  }
  if (!document.querySelector(".advencedStats")) advencedStats = null;
});

function getAndUpdateData() {
  const params = JSON.stringify(toggleList);

  const url = `http://localhost:8000/api/stats/?list=${params}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => updateGraph(data))
    .catch((error) => console.error("Erreur :", error));
}

function fillParams(data) {
  toggles = document.querySelectorAll(".toggle");
  toggles.forEach((toggle) => {
    toggle.parentNode.removeChild(toggle);
  });
  const boxes = [];
  addToggle(true, CURRENT_USER, boxes);
  if (data) {
    data.forEach((user) => {
      addToggle(false, user, boxes);
    });
  } else {
    (async () => {
      const data = await fetchGET(URI.USERS);
      data.forEach((user) => {
        addToggle(false, user, boxes);
      });
    })();
  }
}

function handleChange(event) {
  const id = event.target.id;
  const isChecked = event.target.checked;

  const index = toggleList.indexOf(id);

  if (isChecked && index === -1) toggleList.push(id);
  else if (!isChecked && index !== -1) toggleList.splice(index, 1);

  getAndUpdateData();
}

function addToggle(state, player, boxes) {
  if (player.is_friend == false) return;
  const panel = document.querySelector(".comp-panel");

  const label = document.createElement("label");
  label.classList.add("toggle");

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = state;
  input.disabled = state;
  input.id = player.id;
  input.addEventListener("change", handleChange);
  label.appendChild(input); // Ajouter l'input à l'élément label

  boxes.push(input);

  // Créer l'élément span pour le slider
  const span = document.createElement("span");
  span.classList.add("slider");
  label.appendChild(span); // Ajouter le span à l'élément label

  const p = document.createElement("p");
  p.classList.add("toggle-name");
  p.textContent =
    player.id == CURRENT_USER.id ? `${player.username} (moi)` : player.username;
  label.appendChild(p);

  if (state) {
    label.style.cursor = "not-allowed"; // Curseur interdit si l'état est vrai
  } else {
    label.style.cursor = "pointer"; // Curseur pointeur si l'état est faux
  }

  panel.appendChild(label);
}

function updateGraph(fetchData) {
  const titles = [
    "Matchs gagnés (en %)",
    "Demies finales gagnées (en %)",
    "Finales gagnées (en %)",
  ];
  radialCharts.forEach((chart, index) => {
    var data =
      index == 0
        ? fetchData.percentWon
        : index == 1
        ? fetchData.percentWonDemi
        : fetchData.percentWonFinal;
    var dataLen = data.map((item) => item.data).length;
    chart.updateOptions({
      series: data.map((item) => item.data),
      labels: dataLen < 2 ? [""] : data.map((item) => item.label),
      title: {
        text: titles[index],
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            value: {
              offsetY: dataLen < 2 ? 0 : 10,
            },
          },
        },
      },
    });
  });

  barCharts.forEach((chart, index) => {
    var data = index == 0 ? fetchData.buts : fetchData.duration;
    chart.updateOptions({
      series: data,
    });
  });
}

function fillDataHistoric() {
  const table = document.querySelector(".historic-game-table tbody");
  table.innerHTML = "";

  (async () => {
    const data = await fetchGET(URI.HISTORY);
    data.data.forEach((match) => {
      const tr = document.createElement("tr");

      const matchDate = document.createElement("td");
      matchDate.textContent = match.formatted_date;
      tr.appendChild(matchDate);

      const matchGame = document.createElement("td");
      matchGame.textContent = match.game;
      tr.appendChild(matchGame);

      const matchOpponent = document.createElement("td");
      matchOpponent.textContent = match.opponent;
      tr.appendChild(matchOpponent);

      const matchResult = document.createElement("td");
      matchResult.textContent = match.result;
      tr.appendChild(matchResult);

      const matchDuration = document.createElement("td");
      matchDuration.textContent = match.duration;
      tr.appendChild(matchDuration);

      table.appendChild(tr);
    });
  })();
}

/****************************************************************************
 * FIN Graph stats
 ***************************************************************************/

const superData = {
  buts: [
    { name: "pamartin", data: [10, 15] },
    { name: "dduraku", data: [10, 15] },
  ],
  duration: [
    { name: "pamartin", data: [3, 5, 3] },
    { name: "dduraku", data: [3, 6, 5] },
  ],
  percentWon: [
    { label: "pamartin", data: 67.0 },
    { label: "dduraku", data: 80.3 },
  ],
  percentWonDemi: [
    { label: "pamartin", data: 57 },
    { label: "dduraku", data: 65 },
  ],
  percentWonFinal: [
    { label: "pamartin", data: 5 },
    { label: "dduraku", data: 15 },
  ],
};

const fakeData = {
  data: [
    {
      date: "7 Avril",
      game: "Pong",
      opponent: "dduraku",
      result: "Gagné",
      duration: "2 min",
    },
    {
      date: "7 Avril",
      game: "Oxo",
      opponent: "dduraku",
      result: "Perdu",
      duration: "1 min",
    },
    {
      date: "7 Avril",
      game: "Oxo",
      opponent: "dduraku",
      result: "Egalité",
      duration: "4 min",
    },
    {
      date: "7 Avril",
      game: "Pong",
      opponent: "dduraku",
      result: "Gagné",
      duration: "2 min",
    },
  ],
};
