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

    inputGame.addEventListener('input', function(){
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
}
