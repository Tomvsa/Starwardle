const divGame = document.getElementById('game');
const inputGame = document.getElementById('search');
const randomCharacter = document.getElementById('random');
const buttonStart = document.getElementById('startGame');
const buttonCheck = document.getElementById('check');
buttonStart.addEventListener('click', startGame);

function startGame(){
    buttonStart.style.visibility = 'hidden';
    fetch(`http://localhost:3000/random`)
    .then(response => response.json())
    .then(character => {
        randomCharacter.innerHTML = "<b>Adivina el personaje</b>";
        randomCharacter.innerHTML += `<br><i class="fa-solid fa-text-height"></i> Height: ${character.height}`;
        randomCharacter.innerHTML += `<br><i class="fa-solid fa-palette"></i> Hair Color: ${character.hair_color}`;
        randomCharacter.innerHTML += `<br><i class="fa-solid fa-hand-dots"></i> Skin Color: ${character.skin_color}`;
        randomCharacter.innerHTML += `<br><i class="fa-solid fa-eye"></i> Eye Color: ${character.eye_color}`;
        randomCharacter.innerHTML += `<br><i class="fa-solid fa-cake-candles"></i> Birth Year: ${character.birth_year}`;
        randomCharacter.innerHTML += `<br><i class="fa-solid fa-venus-mars"></i> Gender: ${character.gender}`;
        randomCharacter.style.border = '1px solid white';
        randomCharacter.style.backgroundColor = '#f5f5f59a';
    })

    inputGame.addEventListener('input',function(){
        const searchTerm = inputGame.value.trim();
        if(searchTerm.length === 0){
            divGame.innerHTML = "";
            return;
        }
        fetch(`http://localhost:3000/search?term=${searchTerm}`)
        .then(response => response.json())
        .then(characters => {
            divGame.innerHTML = "";
            characters.forEach(character => {
                const li = document.createElement('li');
                li.innerHTML = `${character.name}`;
                li.style.cursor = "pointer";
                li.addEventListener('mouseover', function(){
                    li.style.backgroundColor = "rgba(199, 191, 191, 0.459)";
                });
                li.addEventListener('mouseout', function() {
                    li.style.backgroundColor = '';
                  });
                li.addEventListener('click', function(){
                    inputGame.value = `${character.name}`;
                });
                if(character.imageName){
                    li.innerHTML += ` <img width='30px' src='/App/Server/images/${character.imageName}'>`
                }
                divGame.appendChild(li);
            });
        })
        .catch(error => console.error(error));
    
    });

    buttonCheck.addEventListener('click', function(){
        const name = inputGame.value.trim().toLowerCase().replace(/\s/g, '_');
        fetch(`http://localhost:3000/compare/${name}`)
        .then(response => response.json())
        .then(comparisonResult => {
            // Mostrar los resultados de la comparación
            let height = (comparisonResult.height) ? '✅' : '❌';
            let hair_color = (comparisonResult.hair_color) ? '✅' : '❌';
            let skin_color = (comparisonResult.skin_color) ? '✅' : '❌';
            let eye_color = (comparisonResult.eye_color) ? '✅' : '❌';
            let birth_year = (comparisonResult.birth_year) ? '✅' : '❌';
            let gender = (comparisonResult.gender) ? '✅' : '❌';
            randomCharacter.innerHTML += `<br>-------------`;
            randomCharacter.innerHTML += `<br><i class="fa-solid fa-user"></i> Name: ${name}`;
            randomCharacter.innerHTML += `<br><i class="fa-solid fa-text-height"></i> Height: ${height}`;
            randomCharacter.innerHTML += `<br><i class="fa-solid fa-palette"></i> Hair Color: ${hair_color}`;
            randomCharacter.innerHTML += `<br><i class="fa-solid fa-hand-dots"></i> Skin Color: ${skin_color}`;
            randomCharacter.innerHTML += `<br><i class="fa-solid fa-eye"></i> Eye Color: ${eye_color}`;
            randomCharacter.innerHTML += `<br><i class="fa-solid fa-cake-candles"></i> Birth Year ${birth_year}`;
            randomCharacter.innerHTML += `<br><i class="fa-solid fa-venus-mars"></i> Gender ${gender}`;
            if (comparisonResult.height && comparisonResult.hair_color && comparisonResult.skin_color &&
                comparisonResult.eye_color && comparisonResult.birth_year && comparisonResult.gender) {
                divGame.innerHTML = "¡Felicidades! ¡Has ganado! 🤩🤩";
                buttonCheck.disabled = true;
                const buttonReset = document.createElement('button');
                buttonReset.classList.add('btn', 'button-custom');
                buttonReset.textContent = "Reset";
                const div = document.getElementsByClassName('col-4')[0];
                buttonReset.addEventListener('click', function(){
                window.location.reload()
                });
                div.appendChild(buttonReset);
            }
        })
        .catch(error => {
            divGame.innerHTML = "el personaje no se ha encontrado, intenta de nuevo 😢";
        });
    });

}
