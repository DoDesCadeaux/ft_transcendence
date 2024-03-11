/****************************************************************************
 * FETCH GET
 *
 * Ensemble des differents fetch pour la methode GET. avec la liste des uri
 ***************************************************************************/

/**
 * Enumération des URIs possibles pour la fonction fetchGET.
 * @enum {string}
 */
const URI = {
  /**
   * Récupère la liste des utilisateurs.
   * @type {string}
   * @returns id - username - state - photo
   */
  USERS: "/api/users",
  /**
   * Récupère le nombre de matchs joués et de matchs gagnés.
   * @type {string}
   * @returns total + won
   */
  MATCEHSWON: "/api/results/matchs/",
};

/**
 * @abstract Effectue une requête GET vers une URI spécifiée.
 *
 * @param {keyof typeof URI} uri  L'URI vers laquelle effectuer la requête GET.
 *   Les URIs possibles incluent :
 *   - `URI.USERS` : Récupère la liste des utilisateurs sans l'utilisateur actuel.
 *         > id - username - state - photo
 *   - `URI.MATCEHSWON` : Récupère le nombre de matchs joués et de matchs gagnés.
 *         > total - won
 * 
 * @returns {Promise<any>} Objet json récupéré ou erreur
 */
async function fetchGET(uri) {
  try {
    const response = await fetch(uri);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    throw error;
  }
}


/****************************************************************************
 * FIN FETCH GET
 ***************************************************************************/

