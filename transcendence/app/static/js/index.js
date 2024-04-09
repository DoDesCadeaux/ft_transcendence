const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
const CURRENT_USER = {
  id: document.body.getAttribute("data-user-id"),
  username: document.body.getAttribute("data-user-username"),
  photo: document.body.getAttribute("data-user-photo"),
};
const currentUserId = document.body.getAttribute("data-user-id");
const currentuserName = document.body.getAttribute("data-user-name");

function loadScript(src, defer) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Impossible de charger le fichier : ${src}`));
    };

    document.body.appendChild(script);
  });
}

// Liste des fichiers JavaScript à charger
const filesToLoad = [
  "../static/js/fetch.js",
  "../static/js/optionsApexChart.js",
  "../static/js/dash.js",
  "../static/js/pong.js",
  "../static/js/game.js",
  "../static/js/profile.js",
  "../static/js/modale.js",
  "../static/js/listPlayers.js",
];

// Charger tous les fichiers en parallèle
const loadPromises = filesToLoad.map((file) =>
  loadScript(file, file === "../static/js/main.js")
);

// Attendre que tous les fichiers soient chargés
Promise.all(loadPromises)
  .then(() => {
    console.log("Tous les fichiers JavaScript sont chargés avec succès.");
  })
  .catch((error) => {
    console.error(
      "Une erreur s'est produite lors du chargement des fichiers JavaScript :",
      error
    );
  });

function adpatUriToFetch(uri) {
  if (/^\/+$/.test(uri)) return "/dashboard_fragment";
  else return uri.replace(/\/([^\/]*)$/, "$1_fragment");
}

document.addEventListener("DOMContentLoaded", function () {
  const app = document.querySelector(".content"); // Sélectionnez l'élément .content
  function loadPage(uri) {
    fetch(adpatUriToFetch(uri))
      .then((response) => response.text())
      .then((data) => {
        app.innerHTML = data;
      })
      .catch((error) => {
        console.error("Error loading page:", error);
      });
  }

  function handleNavigationClick(event) {
    const isNavLink = event.target.classList.contains("nav-link");
    if (isNavLink) {
      event.preventDefault();
      const uri = event.target.getAttribute("href");
      loadPage(uri);
      history.pushState(null, null, uri);
    }
  }

  document.addEventListener("click", handleNavigationClick);

  function handlePopState(event) {
    const uri = window.location.pathname;
    loadPage(uri);
  }

  window.addEventListener("popstate", handlePopState);

  const initialURI = window.location.pathname;
  loadPage(initialURI);
});

let isFetching = false; 

// async function fetchNotifications() {
//   if (isFetching) {
// 	console.log("fetch en cours ...")
//     return;
//   }
//   isFetching = true;

//   const response = await fetch(URI.CHECK_NOTIF_RECEIVED);
//   if (response.ok) {
//     const data = await response.json();

//     text = document.createElement("p");
//     text.textContent = `Hey ${data.to}, ${data.from} t'attends pour jouer une partie de ${data.type}`;
//     contentNotification.appendChild(text);
//     div = document.createElement("div");
//     div.classList.add("bloc-btn-notif");
//     btn1 = document.createElement("div");
//     btn1.classList.add("btn-notification-game");
//     btn1.textContent = "Accepter";
//     btn2 = document.createElement("div");
//     btn2.classList.add("btn-notification-game");
//     btn2.textContent = "Refuser";

//     btn1.addEventListener("click", () => {
//       closeAndUpdate(1, data.id);
// 	  isFetching = false;
//     });

//     btn2.addEventListener("click", () => {
//       closeAndUpdate(2, data.id);
// 	  isFetching = false;
//     });
//     div.appendChild(btn1);
//     div.appendChild(btn2);
//     contentNotification.appendChild(div);

//     modal.style.display = "block";
// 	if (isFetching){
// 		setTimeout(() => {
// 		  closeAndUpdate(3, data.id);
// 		  isFetching = false; 
// 		}, 6000);
// 	}
//   } else 
//     isFetching = false; 
  
// }

// setInterval(fetchNotifications, 1000);

// function closeAndUpdate(state, id) {
//   modal.style.display = "none";
//   contentNotification.innerHTML = "";
//   window.onclick = null;

//   const formData = new FormData();
//   formData.append("id", id);
//   formData.append("state", state);
//   fetch(`/api/notif/update/`, {
//     method: "POST",
//     body: formData,
//     headers: {
//       "X-CSRFToken": csrftoken,
//     },
//   })
//     .then((response) => {
//       response.json();
//       console.log(response);
//     })
//     .catch((error) => {
//       console.error("Erreur lors d'update de la notif' :", error);
//     });
// }
