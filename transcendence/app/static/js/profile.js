(async () => {
    const data = await fetchGET(URI.USER);
    const banner_username = document.querySelector(".top-banner .user .name")
    const banner_photo = document.querySelector(".top-banner .user .photo")
    if (banner_photo){
        banner_username.textContent = data.username;
        banner_photo.src = data.photo + '?timestamp=' + new Date().getTime()
    }
    console.log(data.photo)

  })();

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
    var photoName = '';
    formData.append('username', inputUsername);
    if (file) {
        photoName = `${user_id}.jpg`;
        formData.append('photo', file, photoName);
        console.log(file)
    }

    fetch(`/api/update_user/${user_id}/`, {
        method: 'PUT',
        body: formData,
        headers: {
            'X-CSRFToken': csrftoken,
        },
    })
    .then(response =>  {
        (async () => {
            console.log("coucou")
            const data = await fetchGET(URI.USER);
            const banner_username = document.querySelector(".top-banner .user .name")
            const banner_photo = document.querySelector(".top-banner .user .photo")
            banner_username.textContent = data.username;
            banner_photo.src = data.photo + '?timestamp=' + new Date().getTime()
            console.log(data.photo)

          })();
    
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    });

    document.getElementById('profilePicture').value = '';

    contentNotification.textContent = `Ton profil a bien été mis a jour.`;
    modal.style.display = "block";

    


}
