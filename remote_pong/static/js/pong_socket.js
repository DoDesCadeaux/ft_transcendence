// Définition de l'URL WebSocket pour la connexion au backend
const baseWebSocketURL = "ws://127.0.0.1:8000/ws";   // approprié https

// Init le websocket lié au pong
const websocketURL = baseWebSocketURL + window.location.pathname;
console.log(websocketURL);
const ws = new WebSocket(websocketURL);

// VARIABLES DU JEU
let game_state = "ON";  // Etat du jeu
let allPlayers = [];    // Liste de tous les joueurs
let player_count;       // Nombre de joueurs
let player_index = 0;   // Index joueur actuel dans liste des joueurs
let player1;
let player2;

// Gestionnaire fermeture/refresh de la fenêtre
window.onbeforeunload = function (event) {
    if(game_state !== "ON")
        return;
    return "refresh/close?"
};

// Gestionnaire ouverture de connexion WebSocket
// S'execute quand la connection ws est ouverte
ws.onopen = function (e) {
    // Signale connexion d'un joueur au server
    ws.send(
      JSON.stringify({
        command: "player_joined",
        info: `${loc_username} just Joined `,
        user: loc_username,
      })
    );
  };

// FONCTIONS
function refreshPage() 
{
    window.location.reload();
}