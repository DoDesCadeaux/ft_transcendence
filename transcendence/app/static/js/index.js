function loadScript(src) {
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
  
	  document.head.appendChild(script);
	});
  }
  
  // Liste des fichiers JavaScript à charger
  const filesToLoad = [
	'../static/js/pong.js',
	'../static/js/game.js',
	'../static/js/profile.js',
  ];
  
  // Charger tous les fichiers en parallèle
  const loadPromises = filesToLoad.map(file => loadScript(file));
  
  // Attendre que tous les fichiers soient chargés
  Promise.all(loadPromises)
	.then(() => {
	  console.log('Tous les fichiers JavaScript sont chargés avec succès.');
	  // Votre code ici, une fois que tous les fichiers sont chargés.
	})
	.catch(error => {
	  console.error('Une erreur s\'est produite lors du chargement des fichiers JavaScript :', error);
	});