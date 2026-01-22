const loadDogsBtn = document.getElementById('load-dogs-btn');
let dogContainer = false;
let catContainer = false;
const petsContainer = document.getElementById('pets-container');
const loadCatsBtn = document.getElementById('load-cats-btn');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const type = params.get('type');
const confirmBtn = document.getElementById('confirm-adoption-btn');

const dogs = [
    { id: "1", name: "Rocky", weight: "10kg", img: "/imagesDog/dog1.png" },
    { id: "2", name: "Firulais", weight: "15kg", img: "/imagesDog/dog2.png" },
    { id: "3", name: "Buddy", weight: "20kg", img: "/imagesDog/dog3.png" },
];
const cats = [
    { id: "1", name: "Yuki", weight: "5kg", img: "/imagesCat/cat1.png" },
    { id: "2", name: "Yuki2", weight: "6kg", img: "/imagesCat/cat2.png" },
    { id: "3", name: "Yuki3", weight: "7kg", img: "/imagesCat/cat3.png" },
];
let pet = null;
if (type === 'dog') {
    pet = dogs.find(dog => dog.id === id);
} else if (type === 'cat') {
    pet = cats.find(cat => cat.id === id);
}

if (loadDogsBtn && loadCatsBtn && petsContainer) {
    loadDogsBtn.addEventListener('click', () => {
        if (!dogContainer) {
            fetch('/views/partials/dogs.html')
                .then(response => response.text())
                .then(html => {
                    petsContainer.innerHTML = html;
                    petsContainer.style.display = 'block';
                    dogContainer = true;
                    catContainer = false;
                    adoptedState(petsContainer);

                })
                .catch(error => console.error('Error fetching the dogs.html file:', error));

        } else {

            petsContainer.innerHTML = '';
            petsContainer.style.display = 'none';
            dogContainer = false;
        }
    });


    loadCatsBtn.addEventListener('click', () => {
        if (!catContainer) {
            fetch('/views/partials/cats.html')
                .then(response => response.text())
                .then(html => {
                    petsContainer.innerHTML = html;
                    petsContainer.style.display = 'block';
                    catContainer = true;
                    dogContainer = false;
                    adoptedState(petsContainer);
                })
                .catch(error => console.error('Error fetching the cats.html file:', error));

        } else {

            petsContainer.innerHTML = '';
            petsContainer.style.display = 'none';
            catContainer = false;

        }
    });
}

document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('adoption-btn')) {
        const article = event.target.closest('article');
        const id = article.getAttribute('data-id');
        const type = article.getAttribute('data-type');
        window.location.href = `adoption.html?type=${type}&id=${id}`;
    }
});

if (pet) {
    document.getElementById('pet-name').textContent = "Name: " + pet.name;
    document.getElementById('pet-weight').textContent = "Weight: " + pet.weight;
    document.getElementById('pet-image').src = pet.img;
}

function adoptPet() {
    return JSON.parse(localStorage.getItem('adoptedPets')) || {};
}

function saveAdoptedPet(type, id) {
    const adoptedPets = adoptPet();
    adoptedPets[`${type}:${id}`] = true;
    localStorage.setItem('adoptedPets', JSON.stringify(adoptedPets));
}
function isPetAdopted(type, id) {
    const adoptedPets = adoptPet();
    return adoptedPets[`${type}:${id}`] === true;
}

if (confirmBtn) {
    if (isPetAdopted(type, id)) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Adopted";
    }
    confirmBtn.addEventListener('click', () => {
        saveAdoptedPet(type, id);
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Adopted";
    });
}

function adoptedState(container) {
    if (!container) return;

    container.querySelectorAll("article").forEach(article => {
        const id = article.dataset.id;
        const type = article.dataset.type;
        const btn = article.querySelector(".adoption-btn");
        if (!btn || !id || !type) return;

        btn.disabled = isPetAdopted(type, id);
        btn.textContent = btn.disabled ? "Adopted" : "Adopt me";

    });
}
