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
        randomCharacter.innerHTML += `<br>Height: ${character.height}`;
        randomCharacter.innerHTML += `<br>Hair Color: ${character.hair_color}`;
        randomCharacter.innerHTML += `<br>Skin Color: ${character.skin_color}`;
        randomCharacter.innerHTML += `<br>Eye Color: ${character.eye_color}`;
        randomCharacter.innerHTML += `<br>Birth Year: ${character.birth_year}`;
        randomCharacter.innerHTML += `<br>Gender: ${character.gender}`;
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
                    li.innerHTML += ` <img width='30px' src='/AppStarwar/App/Server/images/${character.imageName}'>`
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
            randomCharacter.innerHTML += `<br>name: ${name}`;
            randomCharacter.innerHTML += `<br>height: ${height}`;
            randomCharacter.innerHTML += `<br>hair_color: ${hair_color}`;
            randomCharacter.innerHTML += `<br>skin_color: ${skin_color}`;
            randomCharacter.innerHTML += `<br>eye_color: ${eye_color}`;
            randomCharacter.innerHTML += `<br>birth_year ${birth_year}`;
            randomCharacter.innerHTML += `<br>gender ${gender}`;
            if (comparisonResult.height && comparisonResult.hair_color && comparisonResult.skin_color &&
                comparisonResult.eye_color && comparisonResult.birth_year && comparisonResult.gender) {
                divGame.innerHTML = "¡Felicidades! ¡Has ganado! 🤩🤩";
                buttonCheck.style.visibility = 'hidden';
                const buttonReset = document.createElement('button');
                buttonReset.classList.add('btn', 'btn-warning');
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
