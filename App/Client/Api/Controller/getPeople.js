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
                    const add_image = document.createElement('input');
                    add_image.type = "file";
                    add_image.id = "file";
                    transfer_data.innerHTML = '<b>transferData</b>';
                    transfer_data.addEventListener('click', function() {
                        const characterInfo = {
                            name: character.name,
                            height: character.height,
                            hair_color: character.hair_color,
                            skin_color: character.skin_color,
                            eye_color: character.eye_color,
                            birth_year: character.birth_year,
                            gender: character.gender
                        };
                    
                        // Verifica si se seleccionó una imagen
                        if (add_image.files.length > 0) {
                            const formData = new FormData();
                            formData.append('characterInfo', JSON.stringify(characterInfo));
                            formData.append('image', add_image.files[0]);

                    
                            fetch('http://localhost:3000/persona', {
                                method: 'POST',
                                body: formData
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error al guardar la información del personaje.');
                                }
                                console.log('Información del personaje guardada correctamente.');
                                return response.text();
                            })
                            .then(data => {
                                console.log(data);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                        } else {
                            const formData = new FormData();
                            formData.append('characterInfo', JSON.stringify(characterInfo));
                            fetch('http://localhost:3000/persona', {
                                method: 'POST',
                                body: formData
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error al guardar la información del personaje.');
                                }
                                console.log('Información del personaje guardada correctamente.');
                                return response.text();
                            })
                            .then(data => {
                                console.log(data);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                        }
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
