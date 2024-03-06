const invitationRecue = document.querySelector('.invitation-received');
const invitationEnvoyee = document.querySelector('.invitation-sent');

const searchInput = document.querySelector("#search-input");
const autoComplete = document.querySelector(".autocomplete");
const search = document.querySelectorAll(".search");

//Simulation db pour invitations recues et envoyees
const recus = ['dduraku', 'tangzer', 'truc', 'autre truc'];
const envoyes = ['dduraku', 'tangzer', 'truc', 'autre truc', 'dduraku', 'tangzer', 'truc', 'autre truc'];
const propositions = ['robert', 'sebastien', 'pierre', 'paul', 'jaques'];


// printInvitation(invitationRecue, 'received', recus);
// printInvitation(invitationEnvoyee, 'sent', envoyes);


function printInvitation(object, type, data) {
    console.log(data);
    const itemsPerPage = 3;
    let currentPage = 0;

    function displayPage(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageItems = data.slice(startIndex, endIndex);

        object.innerHTML = type == 'received' ? 'Invitation(s) recue(s)' : 'Invitation(s) envoyee(s)';

        const ul = document.createElement("ul");
        currentPageItems.forEach(element => {
            const li = document.createElement("li");
            li.classList.add("pointer");
            li.textContent = element;
            //ajouter le onclique pour lancer le jeu
            ul.appendChild(li);
        });

        navigation.appendChild(previous);
        navigation.appendChild(next);

        object.appendChild(ul);
        object.appendChild(navigation)
    }

    function updateNavigation() {
        previous.classList.toggle("disabled", currentPage === 0);
        next.classList.toggle("disabled", currentPage === Math.floor(data.length / itemsPerPage));
    }

    const navigation = document.createElement("div");
    const previous = document.createElement("div");
    const next = document.createElement("div");

    navigation.classList.add("navigation");
    previous.classList.add("previous", "pointer");
    next.classList.add("next", "pointer");

    previous.textContent = "<";
    next.textContent = ">";

    previous.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            displayPage(currentPage);
            updateNavigation();
        }
    });

    next.addEventListener("click", () => {
        if (currentPage < Math.floor(data.length / itemsPerPage)) {
            currentPage++;
            displayPage(currentPage);
            updateNavigation();
        }
    });

    displayPage(currentPage);
    updateNavigation();
}

function handleInputSearchEvent() {
    return function () {
        const searchTerm = searchInput.value.trim();

        // Efface la liste d'autocomplétion
        autoComplete.innerHTML = "";

        // Si la recherche est vide, quitte la fonction
        if (searchTerm === "") {
            return;
        }

        // Si on clique a l'exterieur de la zone d'autocomplétion -> on efface la liste
        document.addEventListener("click", function (event) {
            const isAutocompleteClick = autoComplete.contains(event.target);

            if (!isAutocompleteClick)
                autoComplete.innerHTML = "";
        });

        propositions.forEach((proposition) => {
            const listItem = document.createElement("li");
            listItem.textContent = proposition;
            autoComplete.appendChild(listItem);

            // Ajoute un gestionnaire d'événement pour sélectionner un résultat
            listItem.addEventListener("click", function () {
                searchInput.value = proposition;
                autoComplete.innerHTML = "";
                search.id = proposition;
                console.log(search);
            });
        });
    };
}

// Gestionnaire d'evenement pour le input de la bar de recherche
searchInput.addEventListener("input", handleInputSearchEvent());

function select() {
    envoyes.push(search.id);
    search.id = "";
    searchInput.value = "";
    printInvitation(invitationEnvoyee, 'sent', envoyes);
}


function previewProfile() {
    const fileInput = document.getElementById('profilePicture');
    const previewImage = document.querySelector('.preview-img');
    const previewUsername = document.querySelector('#preview-username');
    const inputUsername = document.querySelector('#username').value;

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    previewUsername.textContent = inputUsername;
}

function updateProfile() {
    // logique d'envoi des données au backend
}