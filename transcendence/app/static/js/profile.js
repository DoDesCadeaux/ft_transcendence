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

function updateProfile(element) {
    const inputUsername = document.querySelector('#username').value;
    const file = document.getElementById('profilePicture').files[0];
    const user_id = element.id;
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const formData = new FormData();
    formData.append('username', inputUsername);
    if (file) {
        const photoName = `${user_id}.jpg`;
        formData.append('photo', file, photoName);
    }

    fetch(`/api/update_user/${user_id}/`, {
        method: 'PUT',
        body: formData,
        headers: {
            'X-CSRFToken': csrftoken,
        },
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    });

    document.getElementById('profilePicture').value = '';

    contentNotification.textContent = "Ton profil a été mis a jour. Tu peux recharger la page pour visualiser les modifications";
    modal.style.display = "block";
}
