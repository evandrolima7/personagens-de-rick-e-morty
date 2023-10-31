// URL da API
const urlApi = 'https://rickandmortyapi.com/api/character';
let currentPage = 1;

// Função para configurar a paginação usando Bootstrap
function setupPagination(totalPages) {
    $('#pagination').twbsPagination({
        totalPages: totalPages,
        visiblePages: 4,
        onPageClick: function (event, page) {
            currentPage = page;
            // Obtém os filtros de pesquisa atuais
            const searchInput = document.getElementById('searchInput').value;
            const statusFilter = document.getElementById('statusFilter').value;
            const genderFilter = document.getElementById('genderFilter').value;

            if (searchInput || statusFilter || genderFilter) {
                // Se houver filtros, buscar personagens com filtros
                buscarPersonagensComFiltros(searchInput, statusFilter, genderFilter);
            } else {
                // Caso contrário, buscar dados da API com a página atual
                buscarDadosDaAPIPaginada(currentPage);
            }
        }
    });
}

// Função para buscar dados da API com paginação
function buscarDadosDaAPIPaginada(page) {
    fetch(`${urlApi}?page=${page}`)
        .then(response => response.json())
        .then(data => {
            const personagens = data.results;
            popularListaDePersonagens(personagens);
        })
        .catch(error => {
            console.error('Erro ao buscar dados da API:', error);
        });
}

// Função para popular a lista de personagens
function popularListaDePersonagens(personagens) {
    const listaDePersonagens = document.getElementById('characterList');
    listaDePersonagens.innerHTML = '';

    personagens.forEach(personagem => {
        const cardDoPersonagem = document.createElement('div');
        cardDoPersonagem.classList.add('card');
        cardDoPersonagem.innerHTML = `
            <img src="${personagem.image}" class="card-img-top" alt="${personagem.name}">
            <div class="card-body">
                <h5 class="card-title">${personagem.name}</h5>
                <p class="card-text">Status: ${personagem.status}</p>
                <p class="card-text">Gender: ${personagem.gender}</p>
                <p class="card-text">Location: ${personagem.location.name}</p>
                <a href="personagem.html?id=${personagem.id}" class="btn btn-primary">Details</a>
            </div>
        `;
        listaDePersonagens.appendChild(cardDoPersonagem);
    });
}

// Função para buscar personagens com base nos filtros
function buscarPersonagensComFiltros(name, status, gender) {
    let apiUrl = `${urlApi}?page=${currentPage}`;

    if (name) {
        apiUrl += `&name=${name}`;
    }

    if (status) {
        apiUrl += `&status=${status}`;
    }

    if (gender) {
        apiUrl += `&gender=${gender}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const personagens = data.results;
            popularListaDePersonagens(personagens);
        })
        .catch(error => {
            console.error('Erro ao buscar dados da API:', error);
        });
}

// Event listener para o botão de pesquisa
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function () {
    const searchInput = document.getElementById('searchInput').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const genderFilter = document.getElementById('genderFilter').value;

    if (!searchInput && !statusFilter && !genderFilter) {
        // Se nenhum filtro estiver ativo, buscar dados da API com a página atual
        buscarDadosDaAPIPaginada(currentPage);
    } else {
        // Caso contrário, buscar personagens com filtros
        buscarPersonagensComFiltros(searchInput, statusFilter, genderFilter);
    }
});
// Função para obter o ID do personagem a partir da URL
function obterIdDoPersonagem() {
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('id');
    return characterId;
}

// Função para obter os detalhes do personagem, incluindo a lista de episódios
function obterDetalhesDoPersonagem(characterId) {
    fetch(`${urlApi}/${characterId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na solicitação da API');
            }
            return response.json();
        })
        .then(data => {
            const characterImage = document.getElementById('characterImage');
            const characterName = document.getElementById('characterName');
            const characterStatus = document.getElementById('characterStatus');
            const characterGender = document.getElementById('characterGender');
            const characterSpecies = document.getElementById('characterSpecies');
            const characterOrigin = document.getElementById('characterOrigin');
            const characterLocation = document.getElementById('characterLocation');
            const episodeList = document.getElementById('episodeList');
            const characterCreated = document.getElementById('characterCreated');
            const characterUpdated = document.getElementById('characterUpdated');

            // Preencha os elementos HTML com os detalhes do personagem
            characterImage.src = data.image;
            characterName.textContent = data.name;
            characterStatus.textContent = `Status: ${data.status}`;
            characterGender.textContent = `Gender: ${data.gender}`;
            characterSpecies.textContent = `Specie: ${data.species}`;
            characterOrigin.textContent = `Origin: ${data.origin.name}`;
            characterOrigin.href = data.origin.url;

            // Preencha a lista de episódios
            episodeList.innerHTML = '';
            data.episode.forEach(episodeUrl => {
                fetch(episodeUrl)
                    .then(response => response.json())
                    .then(episodeData => {
                        const episodeItem = document.createElement('li');
                        episodeItem.textContent = `Episode Title: ${episodeData.name}, Episode: ${episodeData.episode}`;
                        episodeList.appendChild(episodeItem);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar informações do episódio:', error);
                    });
            });

            // Preencha as datas de criação e atualização
            characterCreated.textContent = `Creation date: ${data.created}`;
            characterUpdated.textContent = `Last update: ${data.updated}`;
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do personagem:', error);

            // Exibe a mensagem de erro na página
            const errorElement = document.getElementById('error');
            errorElement.textContent = 'Erro ao buscar detalhes do personagem. Tente novamente mais tarde.';
        });
}

// Suponha que você tenha o ID do personagem
const characterId = obterIdDoPersonagem();

// Chame a função para obter os detalhes do personagem
obterDetalhesDoPersonagem(characterId);

// Chamando a função para configurar a paginação
fetch(`${urlApi}`)
    .then(response => response.json())
    .then(data => {
        const totalPages = data.info.pages;
        setupPagination(totalPages);
    });
