const divGame = document.getElementById('game');
const inputGame = document.getElementById('search');
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
            li.textContent = `${character.name}`;
            divGame.appendChild(li);
        });
    })
    .catch(error => console.error(error));

});