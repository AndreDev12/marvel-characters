const gridContent = document.querySelector('#grid');
const form = document.querySelector('#form');
let contentHTML = '';

form.addEventListener('submit', validateForm);

function showResult(){
    makeRequest("B", 100);
}
showResult();

function validateForm(e){
    e.preventDefault();
    clearHTML();
    const characterInput = document.querySelector('#character').value; 
    if(characterInput.trim() === ''){
        showMessage('search for a character');
        return;
    }
    contentHTML = '';
    makeRequest(characterInput, 20);
}

async function makeRequest(nameStartsWith, limit){

    const apiKey = "cb341a04215682f5167325ab4c01108e";
    const hash = "d660b28cdd7b3009e879f0e5d1db419f";
    const urlRequest = `https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=${apiKey}&hash=${hash}&nameStartsWith=${nameStartsWith}&limit=${limit}`;

    const response = await fetch(urlRequest);
    const result = await response.json();
    const characterArray = result.data.results;

    if(characterArray.length !== 0) {
        characterArray.forEach(character => {
            const {urls, thumbnail, name} = character;
            contentHTML += `
                <div class="card">
                    <a href="${urls[0].url}" target="_blank" rel="noopener noreferrer">
                        <img class="character-img" src="${thumbnail.path}.${thumbnail.extension}" alt="${name}">
                    </a>
                    <h3 class="character-name">${name}</h3>
                </div>
            `;
        });
        gridContent.innerHTML = contentHTML;
        form.reset();
        return;
    }
    showMessage('character does not exist');
}

function showMessage(message){
    const earlyWarning = document.querySelector('.alert');
    if(!earlyWarning){
        const paragraph = document.createElement('p');
        paragraph.classList.add('warning', 'alert');
        paragraph.textContent = message;
        const parentMain = gridContent.parentNode;
        parentMain.insertBefore(paragraph, gridContent);

        setTimeout(() => {
            paragraph.remove();
        }, 2000);
        form.reset();
    }
}

function clearHTML(){
    while(gridContent.firstChild){
        gridContent.removeChild(gridContent.firstChild);
    }
}