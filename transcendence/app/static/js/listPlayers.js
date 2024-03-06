const ul = document.querySelector("#list_joueurs");

function updateList(){
    (async () => {
        const data = await fetchGET(URI.USERS);
        data.users.forEach(user => {
            const userLi = ul.querySelector(`li[id="${user.id}"]`);
            userLi ? updateUserData(userLi, user) : createUserLi(ul, user);
          });
    })();
}


function updateUserData(userLi, userData) {
    const status = userLi.querySelector(".status");
    console.log(status);
    console.log(userData.state);
    
}
  
function createUserLi(userList, userData) {
    const userLi = document.createElement('li');
    userLi.id = userData.id;

    const status = document.createElement("div");
    status.classList.add("status");
    if (userData.state != "offline")
        status.classList.add(userData.state);
        
    const pseudo = document.createElement("div");
    pseudo.classList.add("name");
    pseudo.textContent = userData.username;

    userLi.appendChild(status);
    userLi.appendChild(pseudo);

    userList.appendChild(userLi);
}

updateList();

// utiliser le WebSocket en surveillant si il y a une nouvelle entrée dans la table app_user
// ou lorsqu'il y a modification de state pour n'importe quel user
// Dans les 2 cas faire appel a updateList() pour mettre a jours la liste des joueurs et leur
// status dans la partie droite du site 
  