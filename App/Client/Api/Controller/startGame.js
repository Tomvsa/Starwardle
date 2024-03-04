const divGame = document.getElementById('game');
const inputGame = document.getElementById('search');
const randomCharacter = document.getElementById('random');
const buttonStart = document.getElementById('startGame');
const buttonCheck = document.getElementById('check');
buttonStart.addEventListener('click', startGame);

function startGame(){
    fetch(`http://localhost:3000/random`)
    .then(response => response.json())
    .then(character => {
        randomCharacter.innerHTML = "<b>Adivina el personaje</b>";
        randomCharacter.innerHTML += `<br>${character.height}`;
        randomCharacter.innerHTML += `<br>${character.hair_color}`;
        randomCharacter.innerHTML += `<br>${character.skin_color}`;
        randomCharacter.innerHTML += `<br>${character.eye_color}`;
        randomCharacter.innerHTML += `<br>${character.birth_year}`;
        randomCharacter.innerHTML += `<br>${character.gender}`;
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
                li.innerHTML = `${character.name}`
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
            }
        })
        .catch(error => {
            divGame.innerHTML = "el personaje no se ha encontrado, intenta de nuevo 😢";
        });
    });

}
