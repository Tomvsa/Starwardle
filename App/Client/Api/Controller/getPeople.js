let page = 1;
let totalPages = 1;
const button = document.getElementById("getPeople");
const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");
const currentPageSpan = document.getElementById("currentPage");
const totalPagesSpan = document.getElementById("totalPages");

button.addEventListener('click', () => getCharacters(page));
prevButton.addEventListener('click', () => changePage(-1));
nextButton.addEventListener('click', () => changePage(1));

function getCharacters(pageNumber) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                const characters = response.results;
                console.log(characters);
                const div = document.getElementById('results');
                div.innerHTML = '';
                for (let i = 0; i < characters.length; i++) {
                    const character = characters[i];
                    const characterDiv = document.createElement('div');
                    characterDiv.classList.add('character-card');
                    characterDiv.innerHTML = `Name: ${character.name}, <br> Height: ${character.height}, <br> Hair Color: ${character.hair_color}, <br> Skin Color: ${character.skin_color}, <br> Eye Color: ${character.eye_color}, <br> Birth Year: ${character.birth_year}, <br> Gender: ${character.gender} <br>`;
                    const transfer_data = document.createElement('button');
                    const add_image = document.createElement('button');
                    transfer_data.innerHTML = '<b>transferData</b>';
                    add_image.innerHTML = '<b>add image</b>';
                    transfer_data.addEventListener('click', function() {
                        console.log("¡Hola!");
                    });
                    div.appendChild(characterDiv);
                    characterDiv.appendChild(transfer_data);
                    characterDiv.appendChild(add_image);
                    
                }
                totalPages = Math.ceil(response.count / 10);
                updatePagination();
            } else {
                console.error('Error en obtener la información de los personajes.');
            }
        }
    };
    xhr.open('GET', `https://swapi.dev/api/people/?page=${pageNumber}`);
    xhr.send();
}

function changePage(delta) {
    const newPage = page + delta;
    if (newPage >= 1 && newPage <= totalPages) {
        page = newPage;
        getCharacters(page);
    }
}

function updatePagination() {
    currentPageSpan.textContent = `Página ${page}`;
    totalPagesSpan.textContent = ` de ${totalPages}`;
    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
}
