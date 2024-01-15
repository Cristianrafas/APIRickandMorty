const cardDiv = document.getElementById('card-div');
const pagDiv = document.getElementById('pagination-div');
const charCount = document.getElementById('char-count');
const localCount = document.getElementById('local-count');
const epCount = document.getElementById('ep-count');
const urlCharacters = "https://rickandmortyapi.com/api/character";
const urlLocations = "https://rickandmortyapi.com/api/location";
const urlEpisodes = "https://rickandmortyapi.com/api/episode";
let allLocations = [];
let allChars = [];
let charsLength = 0;
let episodesLength = 0;
let currentPage = 1;
let pageChars = [];
let groups = [];
let groupNumber = currentPage - 1;
let totalPages = 0;


async function takePages(url) {
    try {
        const pages = await api.get(url);
        const numberOfPages = pages.data.info.pages;
        return numberOfPages;
    }
    catch (error) {
        console.log('Erro ao carregar dados.', error);
    }
}
async function takeAllChars(page, url) {
    try {
        charPage = await api.get(`${url}/?page=${page}`);
        allChars.push(...charPage.data.results)
    } catch (error) {
        console.log('Erro ao carregar dados.', error);
    }
}

async function takeAllPages(pagesLength, url) {
    for (let i = 1; i <= pagesLength; i++) {
        await takeAllChars(i, url)
    }
    console.log(allChars);
}

async function takeCharsLength() {

    charCount.innerHTML = `${allChars.length}`
}


async function makeGroups(array){
    for (let i = 0; i < array.length; i += 6) {
        groups.push(array.slice(i, i + 6));
    }
    console.log(groups);
    return groups;
}

async function makePage(page, pagNum) {
    cardDiv.innerHTML = "";
    pagDiv.innerHTML = "";

    for (let i = 0; i < groups[page].length; i++) {
        
        const characterCard = document.createElement('div');
        characterCard.classList.add(`card${i}`);
        let lastEp = (groups[page][i].episode.length) - 1;

        characterCard.innerHTML = `
        <img class="card-image" src="${groups[page][i].image}">
        <h2 class="card-title">${groups[page][i].name}</h2>
        <p class="card-status-especie"><span class="${groups[page][i].status === 'Dead' ? 'dead status' : groups[page][i].status === 'Alive' ? 'alive status' : "unknown status"}">O</span> ${groups[page][i].status} - ${groups[page][i].species}</p>
        <p class="card-description-1">Última localização conhecida</p>
        <strong class="card-location">${groups[page][i].location.name}</strong>
        <p class="card-description-2">Visto última vez em</p>
        <p class="card-last-ep">${await takeLastEp(groups[page][i].episode[lastEp])}</p>
        <div class="border"></div>
        `
        cardDiv.appendChild(characterCard)
    }
    const paginationDiv = document.createElement('div');
    paginationDiv.classList.add('pagination');
    
    paginationDiv.innerHTML = `
    <button class='prev' onclick="prevPage()">Prev</button>
    <h2 class='current'>${pagNum}</h2>
    <button class='next' onclick="nextPage()">Next</button>
    `
    pagDiv.appendChild(paginationDiv);
}
async function takeLastEp(url) {
    try {
        const lastep = await api.get(url);
        return lastep.data.name
    }
    catch (error) {
        console.log('Erro ao carregar dados.', error);
    }
}
function nextPage() {
    if (currentPage > totalPages) {
    currentPage += 1;
    makePage(currentPage - 1, currentPage);
    console.log(currentPage);}
    else {
        return
    }
}

function prevPage() {
    if (currentPage > 1){
        currentPage -= 1;
        makePage(currentPage - 1, currentPage)
    }
    else {
        return;
    }
}

async function takeAllLocations(url) {
    try {
        let locations = await api.get(`${url}`);
        console.log(locations)
        let locationsLength = locations.data.info.count;
        localCount.innerHTML = `${locationsLength}`
        return locations;
    } catch (error) {
        console.log('Erro ao carregar dados.', error);
    }
}
async function takeAllEpisodes(url) {
    try {
        let episodes = await api.get(`${url}`);
        episodesLength = episodes.data.info.count;
        epCount.innerHTML = `${episodesLength}`
        return episodes;
    } catch (error) {
        console.log('Erro ao carregar dados.', error);
    }
}

async function execute() {
    pages = await takePages(urlCharacters);
    allLocations = await takeAllLocations(urlLocations);
    await takeAllPages(pages, urlCharacters);
    await takeAllEpisodes(urlEpisodes)
    await takeCharsLength();
    await makeGroups(allChars);
    await makePage(groupNumber, currentPage);
}
execute();




