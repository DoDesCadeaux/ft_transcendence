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
