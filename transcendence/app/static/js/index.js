const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const CURRENT_USER = {
	id : document.body.getAttribute('data-user-id'),
	username : document.body.getAttribute('data-user-username'),
	photo : document.body.getAttribute('data-user-photo'),
}
const currentUserId = document.body.getAttribute('data-user-id');
const currentuserName = document.body.getAttribute('data-user-name');

function loadScript(src, defer) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
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
	'../static/js/fetch.js',
	'../static/js/dash.js',
	'../static/js/listPlayers.js',
    '../static/js/pong.js',
    '../static/js/game.js',
    '../static/js/profile.js',
    '../static/js/modale.js',

];

// Charger tous les fichiers en parallèle
const loadPromises = filesToLoad.map(file => loadScript(file, file === '../static/js/main.js'));

// Attendre que tous les fichiers soient chargés
Promise.all(loadPromises)
    .then(() => {
        console.log('Tous les fichiers JavaScript sont chargés avec succès.');
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors du chargement des fichiers JavaScript :', error);
    });

function adpatUriToFetch(uri) {
		if (/^\/+$/.test(uri))
			return "/dashboard_fragment";
		else 
			return uri.replace(/\/([^\/]*)$/, '$1_fragment');
}
	
document.addEventListener('DOMContentLoaded', function() {
	const app = document.querySelector('.content'); // Sélectionnez l'élément .content
	function loadPage(uri) {
		fetch(adpatUriToFetch(uri))
			.then(response => response.text())
			.then(data => {
				app.innerHTML = data;
			})
			.catch(error => {
				console.error('Error loading page:', error);
			});
	}
	
	function handleNavigationClick(event) {
		const isNavLink = event.target.classList.contains('nav-link');
		if (isNavLink) {
			event.preventDefault();
			const uri = event.target.getAttribute('href');
			loadPage(uri)
			history.pushState(null, null, uri);
		}
	}

	document.addEventListener('click', handleNavigationClick);

	function handlePopState(event) {
		const uri = window.location.pathname;
		loadPage(uri)
	}

	window.addEventListener('popstate', handlePopState);

	// Charger la première page lors du chargement initial
	const initialURI = window.location.pathname;
	loadPage(initialURI);
});
	