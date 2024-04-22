const ul = document.querySelector("#list_joueurs");
const toggleFriends = [];

function updateList() {
  (async () => {
    const data = await fetchGET(URI.USERS);
    data.forEach((user) => {
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
  const userLi = document.createElement("li");
  userLi.id = userData.id;

  const status = document.createElement("div");
  status.classList.add("status");
  if (userData.state != "offline") status.classList.add(userData.state);

  const pseudo = document.createElement("div");
  pseudo.classList.add("name");
  pseudo.textContent = userData.username;

  const followBtn = document.createElement("label");
  followBtn.classList.add("custom-checkbox");

  const inputFollow = document.createElement("input");
  inputFollow.type = "checkbox";
  inputFollow.id = userData.id;
  inputFollow.classList.add("following");
  if (userData.is_friend) inputFollow.checked = true;
  inputFollow.addEventListener("change", handleChangeFriends);
  followBtn.appendChild(inputFollow);

  const checkboxSVG = document.createElement("span");
  checkboxSVG.classList.add("checkbox-svg");
  followBtn.appendChild(checkboxSVG);

  userLi.appendChild(status);
  userLi.appendChild(pseudo);
  userLi.appendChild(followBtn);

  userList.appendChild(userLi);
}

function handleChangeFriends(event) {
  const id = event.target.id;
  const isChecked = event.target.checked;

  const index = toggleFriends.indexOf(id);

  if (isChecked && index === -1) toggleFriends.push(id);
  else if (!isChecked && index !== -1) toggleFriends.splice(index, 1);

  const params = JSON.stringify(toggleFriends);

  const url = `https://localhost:8000/api/friends/update/?list=${params}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      (async () => {
        const data = await fetchGET(URI.USERS);
        fillParams(data)
      })();
    } )
    .catch((error) => console.error("Erreur :", error));

  
}

updateList();

// function getFriends(type){
//   const url2 = `http://localhost:8000/api/friends/get/`;
//   var dataFriends;
//   fetch(url2)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       // if (type == "get")

//     })
//     .catch((error) => console.error("Erreur :", error));
//   console.log(dataFriends);
// }

// utiliser le WebSocket en surveillant si il y a une nouvelle entrée dans la table app_user
// ou lorsqu'il y a modification de state pour n'importe quel user
// Dans les 2 cas faire appel a updateList() pour mettre a jours la liste des joueurs et leur
// status dans la partie droite du site
