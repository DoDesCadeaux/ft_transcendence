
let globalStatMatch = null;

document.body.addEventListener("DOMNodeInserted", function (event) {
    if (document.querySelector("#glabalStatMatch") && !globalStatMatch){
        globalStatMatch = document.querySelector("#glabalStatMatch");
        (async () => {
            const data = await fetchGET(URI.MATCHSWON);
            var msg = data.total == 0 ? "Zéro match a ton actif" : data.won > 0 ? `${data.won} sur ${data.total} de gagnés` : `${data.won} sur ${data.total} de gagné`;
            globalStatMatch.textContent = msg;
          })();
    }
    if (!document.querySelector("#glabalStatMatch")){
        globalStatMatch = null;
    }
  });