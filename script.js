const cardRow = document.getElementById('card-row');
const pagDiv = document.getElementById('pagination-div');
const charCount = document.getElementById('char-count');
const localCount = document.getElementById('local-count');
const epCount = document.getElementById('ep-count');
const urlCharacters = 'https://rickandmortyapi.com/api/character';
const urlLocations = 'https://rickandmortyapi.com/api/location';
const urlEpisodes = 'https://rickandmortyapi.com/api/episode';
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
}

async function takeCharsLength() {
    charCount.innerHTML = `${allChars.length}`
}


async function makeGroups(array) {
    groups = [];
    for (let i = 0; i < array.length; i += 6) {
        groups.push(array.slice(i, i + 6));
    }
    return groups;
}

async function makePage(page, pagNum) {

    cardRow.innerHTML = "";
    pagDiv.innerHTML = "";

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    }),
    
    cardRow.classList.add('loading-indicator');
    try {
        for (let i = 0; i < groups[page].length; i++) {
            const characterCard = document.createElement('div');
            characterCard.classList.add('col-11', 'col-md-5', 'card-div', 'mb-3');
            let lastEp = (groups[page][i].episode.length) - 1;
            characterCard.innerHTML = `
            <div class="row row1">
            <div class="col-4 p-0 ">
                    <img class="card-image" src="${groups[page][i].image}">
                    </div>
                    <div class="col-8 p-0 pb-2 ps-3 ps-md-2">
                    <div class="card-title">${groups[page][i].name}</div>
                    <p class="card-description"><span class="${groups[page][i].status === 'Dead' ? 'dead status' : groups[page][i].status === 'Alive' ? 'alive status' : 'unknown status'}">O</span> ${groups[page][i].status} - ${groups[page][i].species}</p>
                    <p class="card-description">Última localização conhecida</p>
                    <p class="card-description">${groups[page][i].location.name}</p>
                    <p class="card-description">Visto última vez em</p>
                    <p class="card-description">${await takeLastEp(groups[page][i].episode[lastEp])}</p>
                    </div>
                    </div>
                    `;
                    cardRow.classList.remove('loading-indicator');
                    cardRow.appendChild(characterCard)
                }
        const paginationDiv = document.createElement('div');
        paginationDiv.classList.add('pagination');
        
        if (groups.length > 1) {
            let prevButtonDisabled = currentPage === 1 ? 'hidden' : '';
            let prevButtonDisabledTen = currentPage < 11 ? 'hidden' : '';
            let nextButtonDisabled = currentPage === groups.length ? 'hidden' : '';
            let nextButtonDisabledTen = currentPage + 10 > groups.length ? 'hidden' : '';

            paginationDiv.innerHTML = `
    <nav id='pagination-nav' class="d-flex justify-content-center mt-3">
    <ul class="pagination">
            <li class="page-item"><button class="btn btn-secondary opacity-50" onclick="prevPage(10)" ${prevButtonDisabledTen}><10</button></li>
            <li class="page-item"><button class="btn btn-secondary opacity-50" onclick="prevPage(1)" ${prevButtonDisabled}>${(pagNum - 1)}</button></li>
            <li class="page-item"><button class="btn btn-success" disabled>${(pagNum)}</button></li>
            <li class="page-item"><button class="btn btn-secondary opacity-50" onclick="nextPage(1)" ${nextButtonDisabled}>${(pagNum + 1)}</button></li>
            <li class="page-item"><button class="btn btn-secondary opacity-50" onclick="nextPage(10)" ${nextButtonDisabledTen}>10></button></li>
            </ul>
    </nav>
    `;
            pagDiv.appendChild(paginationDiv);
        }
        // hideLoadingIndicator();
    }
    catch (error) {
        console.error("Erro ao carregar página:", error);
        // Lidar com o erro, se necessário
    } 

    
}

function showLoadingIndicator() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('loading-indicator');
    console.log('carregando!')
    cardRow.appendChild(loadingIndicator);
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
function nextPage(num) {
    if (currentPage > totalPages) {
        currentPage += num;
        makePage(currentPage - 1, currentPage);
    }
    else {
        return
    }
}

function prevPage(num) {
    if (currentPage > 1) {
        currentPage -= num;
        makePage(currentPage - 1, currentPage);
    }
    else {
        return;
    }
}

async function takeAllLocations(url) {
    try {
        let locations = await api.get(`${url}`);
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
        epCount.innerHTML = `${episodesLength}`;
        return episodes;
    } catch (error) {
        console.log('Erro ao carregar dados.', error);
    }
}

document.getElementById('search').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        let searchWord = document.getElementById('search-value').value.toLowerCase();
        search(searchWord);
    }
});

async function search(word) {
    try {
        const searchChars = allChars.filter(character => character.name.toLowerCase().includes(word));
        console.log(searchChars);
        await makeGroups(searchChars);
        currentPage = 1;
        await makePage(groupNumber, currentPage);
    } catch (error) {
        console.log('Erro ao fazer pesquisa', error);
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




