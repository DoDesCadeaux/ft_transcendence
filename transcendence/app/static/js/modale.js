const modal = document.getElementById('notificationModal');
const contentNotification = document.querySelector('#content-notif');

/****************************************************************************
 * GESTION DE LA FERMETURE DE LA MODALE
 *
 * FErmeture avec la croix ou bien en cliquant en dehors de la modale
 ***************************************************************************/
function closeNotificationModal() {
    modal.style.display = 'none';
    contentNotification.innerHTML = "";
    window.onclick = null;  // Désactive l'événement de clic après la fermeture de la modal
}

window.onclick = function(event) {
    if (event.target == modal && modal.style.display == 'block') {
      modal.style.display = 'none';
      contentNotification.innerHTML = "";
      window.onclick = null;
    }
};
/****************************************************************************
 * FIN GESTION DE LA FERMETURE DE LA MODALE
 ***************************************************************************/
