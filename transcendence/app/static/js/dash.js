/****************************************************************************
 * GESTION VIGNETTES DASHBOARD LINK DB
 *
 * Récuperation dans la db du raton matchs + tournois joués/gagnés
 ***************************************************************************/
let globalStatMatch = null;

document.body.addEventListener("DOMNodeInserted", function (event) {
  if (document.querySelector("#glabalStatMatch") && !globalStatMatch) {
    globalStatMatch = document.querySelector("#glabalStatMatch");
    (async () => {
      const data = await fetchGET(URI.MATCEHSWON);
      var msg =
        data.total == 0
          ? "Zéro match a ton actif"
          : data.won > 0
          ? `${data.won} sur ${data.total} de gagnés`
          : `${data.won} sur ${data.total} de gagné`;
      globalStatMatch.textContent = msg;
    })();
    globalStatTournament = document.querySelector("#glabalStatTournament");
    globalStatTournament.textContent = "Zéro tournoi a ton actif";
  }
  if (!document.querySelector("#glabalStatMatch")) {
    globalStatMatch = null;
  }
});
/****************************************************************************
 * FIN GESTION VIGNETTES DASHBOARD LINK DB
 ***************************************************************************/

/****************************************************************************
 * GESTION TOURNOIS
 *
 * - affichage des tournois
 ***************************************************************************/
var tournament = null;
// Créer le bouton précédent
const prevButton = document.createElement("button");
prevButton.classList.add("btn");
prevButton.id = "prev";
prevButton.innerHTML = "&#10096;";

// Créer le bouton suivant
const nextButton = document.createElement("button");
nextButton.classList.add("btn");
nextButton.id = "next";
nextButton.innerHTML = "&#10097;";

document.body.addEventListener("DOMNodeInserted", function (event) {
  if (document.querySelector(".include-tournament") && !tournament) {
    tournament = document.querySelector(".include-tournament");
    tournament.appendChild(prevButton);
    tournament.appendChild(nextButton);

    (async () => {
      const dataTournament = await fetchGET(URI.DATA_TOURNAMENT);
      console.log(dataTournament);
      dataTournament.forEach((element, i) => {
        fetch("tournament_fragment/")
          .then((response) => response.text())
          .then((data) => {
            let li = document.createElement("li");
            li.innerHTML = data;
            li.id = element.id;
            classes =
              i == 0
                ? li.classList.add("slide", "active")
                : li.classList.add("slide");
            tournament.appendChild(li);
            const name = li.querySelector(".tournament-name");
            name.textContent = element.name;
            const joinDiv = document.createElement("div");
            joinDiv.classList.add("join");
            joinDiv.textContent = "Rejoindre";
            joinDiv.addEventListener('click', function(event) {
              joinTournament(event);
            });
            name.appendChild(joinDiv);
            let players = li.querySelectorAll(".players-tournament");
            players.forEach((player, index) => {
              const photo = element.players[index]
                ? element.players[index].photo
                : "media/img/anonymous.png";
              player.setAttribute("xlink:href", photo);
            });
            let winners = li.querySelectorAll(".winner-tournament");
            winners.forEach((winner, index) => {
              const photo = element.winners[index] != null
                ? element.winners[index].photo
                : "media/img/anonymous.png";
              winner.setAttribute("xlink:href", photo);
            });
          })
          .catch((error) => {
            console.error("Error loading page:", error);
          });
      });
      const buttons = document.querySelectorAll(".btn");
      const slides = document.getElementsByClassName("slide");
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
    })();
  }
  if (!document.querySelector(".include-tournament")) tournament = null;
});

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
  const id = document.querySelector('.active').id;
  const formData = new FormData();
    formData.append("id", id);
    fetch(`/api/tournament/join/`, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        return response.text()
      })
      .then(data => {
        contentNotification.textContent = JSON.parse(data);
      })
  modal.style.display = "block";
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

  const warning = document.createElement("span");
  warning.textContent = "*** Tu dois remplir ce champ ***";
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
    handleCreateTournament(input, warning);
  };

  contentNotification.appendChild(msg);
  contentNotification.appendChild(input);
  contentNotification.appendChild(warning);
  contentNotification.appendChild(validation);

  modal.style.display = "block";
}

function handleCreateTournament(input, warning) {
  if (!input.value) {
    warning.style.display = "";
  } else {
    contentNotification.innerHTML = "";
    const formData = new FormData();
    const name = encodeURIComponent(input.value);
    formData.append("name", name);
    fetch(`/api/tournament/create/`, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        response.json();
        contentNotification.textContent = `Le tournoi ${name} a bien été créé !`;
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
