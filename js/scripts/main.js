//Paginador slides
var swiper = new Swiper(".mySwiper", {
    effect: 'fade',
    pagination: {
        el: ".swiper-pagination",
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
});


//Modal detalhes do pokemon
const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
const closePokemon = document.querySelector('.js-close-modal-details-pokemon')
const closeOverlay = document.querySelector('.js-overlay-modal-details-pokemon')


cardPokemon.forEach(card => {
    card.addEventListener('click', openDetailsPokemon);
})

closePokemon.addEventListener('click', closeDetailsPokemon);
closeOverlay.addEventListener('click', closeDetailsPokemon);

//Filtro mobile seclect custom

const btnCustomSelect = document.querySelector('.js-open-select-custom')

btnCustomSelect.addEventListener('click', () => {
    btnCustomSelect.parentElement.classList.toggle('active')
})

//Listagem dos pokemons
const areaPokemons = document.getElementById('js-list-pokemons');
const countPokemons = document.getElementById('js-count-pokemons');

function primeiraLetraMaiuscula(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);

}

function createCardPokemons(nome, code, imagePoke, type) {
    let card = document.createElement('button');
    card.classList = `card-pokemon js-open-details-pokemon ${type}`
    card.setAttribute('code-pokemon', code)
    areaPokemons.appendChild(card)

    let image = document.createElement('div');
    image.classList = 'image';
    card.appendChild(image);


    let imageSrc = document.createElement('img');
    imageSrc.classList = 'thumb-img';
    imageSrc.setAttribute('src', imagePoke);
    image.appendChild(imageSrc);

    let infoCardPokemon = document.createElement('div');
    infoCardPokemon.classList = 'info';
    card.appendChild(infoCardPokemon);

    let areaText = document.createElement('div');
    areaText.classList = 'text';
    infoCardPokemon.appendChild(areaText)

    let codePokemon = document.createElement('span');
    codePokemon.textContent = (code < 10) ? `#00${code}` : (code < 100) ? `#0${code}` : `#${code}`;
    areaText.appendChild(codePokemon);

    let nomePokemon = document.createElement('h3');
    nomePokemon.textContent = primeiraLetraMaiuscula(nome);
    areaText.appendChild(nomePokemon);

    let iconType = document.createElement('div');
    iconType.classList = 'icon';
    infoCardPokemon.appendChild(iconType);

    let imgTypeIcon = document.createElement('img');
    imgTypeIcon.setAttribute('src', `img/icon-types/${type}.svg`)
    iconType.appendChild(imgTypeIcon);


}

function listingPokemons(urlApi) {
    axios({
        method: 'GET',
        url: urlApi
    })
        .then((response) => {

            const { results, next, count } = response.data;

            countPokemons.innerText = count;

            results.forEach(pokemon => {
                let urlApiDetails = pokemon.url;

                axios({
                    method: 'GET',
                    url: `${urlApiDetails}`
                })
                    .then(response => {
                        const { name, id, sprites, types } = response.data;

                        const infoCard = {
                            nome: name,
                            code: id,
                            image: sprites.other.dream_world.front_default,
                            type: types[0].type.name,

                        }

                        createCardPokemons(infoCard.nome, infoCard.code, infoCard.image, infoCard.type);

                        const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

                        cardPokemon.forEach(card => {
                            card.addEventListener('click', openDetailsPokemon)
                        })
                    })
            })

        })
}

listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0.')



function openDetailsPokemon() {
    document.documentElement.classList.add('open-modal');
    
    let codePokemon = this.getAttribute('code-pokemon');
    let imagemPokemon = this.querySelector('.thumb-img');
    let iconTypePokemon = this.querySelector('.info .icon img');
    let namePokemon = this.querySelector('.info h3').textContent;
    let codeStringPokemon = this.querySelector('.info span').textContent;


    let iconTypeModal = document.getElementById('js-type-pokemon-modal')
    const modalDetails = document.getElementById('js-type-pokemon-modal-details');
    const imgPokemonModal = document.getElementById('js-image-pokemon-modal');
    const namePokemonModal = document.getElementById('js-name-pokemon-modal');
    const codePokemonModal = document.getElementById('js-code-pokemon-modal');
    const heightPokemonModal = document.getElementById('js-height-pokemon');
    const weightPokemonModal = document.getElementById('js-weight-pokemon');
    const abilitiePokemonModal = document.getElementById('js-main-abilities');


    imgPokemonModal.setAttribute('src', imagemPokemon.getAttribute('src'));
    modalDetails.setAttribute('type-pokemon-modal', this.classList[2]);
    iconTypeModal.setAttribute('src', iconTypePokemon.getAttribute('src'));
    
    namePokemonModal.textContent = namePokemon;
    codePokemonModal.textContent = codeStringPokemon;
    

    axios({
        method: 'GET',
        url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`
    })
    .then(response => {
        let data = response.data;

        let infoPokemon = {
            mainAbilities : primeiraLetraMaiuscula(data.abilities[0].ability.name),
            types : data.types,
            weight : data.weight,
            height : data.height,
            abilities : data.abilities,
            stats : data.stats,
            urlType : data.types[0].type.url
        }

        function listingTypesPokemon() {
            const areaTypesModal = document.getElementById('js-type');
            areaTypesModal.innerHTML = "";

            let arrayTypes = infoPokemon.types;

            arrayTypes.forEach(itemType => {
                let itemList = document.createElement('li');
                areaTypesModal.appendChild(itemList);
                
                let spanList = document.createElement('span');
                spanList.classList = `tag-type ${itemType.type.name}`;
                spanList.textContent = primeiraLetraMaiuscula(itemType.type.name);
                itemList.appendChild(spanList);
            })
            
        }

        function listingWeaknesses() {
            const areaWeak = document.getElementById('js-weak');

            areaWeak.innerHTML = "";

            axios({
                method: 'GET',
                url: `${infoPokemon.urlType}`
            })
            .then(response => {
                let weaknesses = response.data.damage_relations.
                double_damage_from;

                weaknesses.forEach(itemTypeWeak => {
                    let itemListWeak = document.createElement('li');
                    areaWeak.appendChild(itemListWeak);
                    
                    let spanListWeak = document.createElement('span');
                    spanListWeak.classList = `tag-type ${itemTypeWeak.name}`;
                    spanListWeak.textContent = primeiraLetraMaiuscula(itemTypeWeak.name);
                    itemListWeak.appendChild(spanListWeak);
                })
                
            })
        }

        heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
        weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
        abilitiePokemonModal.textContent = infoPokemon.mainAbilities;

        const statsHp =  document.getElementById('js-status-hp');
        const statsAttack =  document.getElementById('js-status-attack');
        const statsDefense =  document.getElementById('js-status-defense');
        const statsSpAttack =  document.getElementById('js-status-sp-attack');
        const statsSpDefense =  document.getElementById('js-status-sp-defense');
        const statsSpeed =  document.getElementById('js-status-speed');

        statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`;
        statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`;
        statsDefense.width = `${infoPokemon.stats[2].base_stat}%`;
        statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`;
        statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`;
        statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`;


        listingTypesPokemon()
        listingWeaknesses()
    })
    
}

function closeDetailsPokemon() {
    document.documentElement.classList.remove('open-modal');
}


//Script para listar todos os tipos de pokemon

const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.querySelector('.dropdown-select')

axios({
    method: 'GET',
    url: 'https://pokeapi.co/api/v2/type'
})
    .then(response => {
        const { results } = response.data;
        results.forEach((type, index) => {

            if (index < 18) {
                let itemType = document.createElement('li');
                areaTypes.appendChild(itemType);

                let buttonType = document.createElement('button');
                buttonType.classList = `type-filter ${type.name}`;
                buttonType.setAttribute('code-type', index + 1);
                itemType.appendChild(buttonType)

                let divIconType = document.createElement('div');
                divIconType.classList = 'icon';
                buttonType.appendChild(divIconType)

                let imgIconType = document.createElement('img');
                imgIconType.setAttribute('src', `img/icon-types/${type.name}.svg`)
                divIconType.appendChild(imgIconType)

                let nomeIconType = document.createElement('span');
                nomeIconType.textContent = primeiraLetraMaiuscula(type.name);
                buttonType.appendChild(nomeIconType)

                //mobile 

                let itemTypeMobile = document.createElement('li');
                areaTypesMobile.appendChild(itemTypeMobile);

                let buttonTypeMobile = document.createElement('button');
                buttonTypeMobile.classList = `type-filter ${type.name}`;
                buttonTypeMobile.setAttribute('code-type', index + 1);
                itemTypeMobile.appendChild(buttonTypeMobile)

                let divIconTypeMobile = document.createElement('div');
                divIconTypeMobile.classList = 'icon';
                buttonTypeMobile.appendChild(divIconTypeMobile)

                let imgIconTypeMobile = document.createElement('img');
                imgIconTypeMobile.setAttribute('src', `img/icon-types/${type.name}.svg`)
                divIconTypeMobile.appendChild(imgIconTypeMobile)

                let nomeIconTypeMobile = document.createElement('span');
                nomeIconTypeMobile.textContent = primeiraLetraMaiuscula(type.name);
                buttonTypeMobile.appendChild(nomeIconTypeMobile)


                const allTypes = document.querySelectorAll('.type-filter');

                allTypes.forEach(btn => {
                    btn.addEventListener('click', filterByTypes)
                })

            }




        })

    })



//Script para o botão load more

const btnLoadMore = document.getElementById('js-btn-load-more');

let countPagination = 10;

function showMorePokemon() {
    listingPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`)

    countPagination = countPagination + 9;
}

btnLoadMore.addEventListener('click', showMorePokemon);


//Funcao para filtrar pokemons por tipo

function filterByTypes() {

    let idPokemon = this.getAttribute('code-type');
    const areaPokemons = document.getElementById('js-list-pokemons');
    const btnLoadMore = document.getElementById('js-btn-load-more');
    const allTypes = document.querySelectorAll('.type-filter');
    const dropdownSelect = document.querySelector('.select-custom')


    areaPokemons.innerHTML = "";
    btnLoadMore.style.display = "none";

    const sectionPokemons = document.querySelector('.s-all-info-pokemons');
    const topSection = sectionPokemons.offsetTop;


    allTypes.forEach(type => {
        type.classList.remove('active')
        dropdownSelect.classList.remove('active')
    })

    window.scrollTo({
        top: topSection + 288,
        behavior: 'smooth'
    })
    this.classList.add('active')

    if (idPokemon) {
        axios({
            method: 'GET',
            url: `https://pokeapi.co/api/v2/type/${idPokemon}`
        })
            .then(response => {
                const { pokemon } = response.data;
                countPokemons.textContent = pokemon.length;
                console.log(pokemon.length);

                pokemon.forEach(pok => {
                    const { url } = pok.pokemon;
                    console.log(url)

                    axios({
                        method: 'GET',
                        url: `${url}`
                    })
                        .then(response => {
                            const { name, id, sprites, types } = response.data;

                            const infoCard = {
                                nome: name,
                                code: id,
                                image: sprites.other.dream_world.front_default,
                                type: types[0].type.name,

                            }

                            if (infoCard.image) {
                                createCardPokemons(infoCard.nome, infoCard.code, infoCard.image, infoCard.type);
                            }


                            const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

                            cardPokemon.forEach(card => {
                                card.addEventListener('click', openDetailsPokemon)
                            })
                        })
                })
            })
    }
    else {
        areaPokemons.innerHTML = "";
        listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0.')
        btnLoadMore.style.display = "block";
    }


}

//Funcao para buscar o pokemon

const btnSearch = document.getElementById('js-btn-search');
const inputSearch = document.getElementById('js-input-search');





function searchPokemon() {
    let valueInput = inputSearch.value.toLowerCase();
    const typeFilter = document.querySelectorAll('.type-filter');

    typeFilter.forEach(type => {
        type.classList.remove('active')
    })

    axios({
        method: 'GET',
        url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`
    })
        .then(response => {

            areaPokemons.innerHTML = "";
            btnLoadMore.style.display = 'none';
            countPokemons.textContent = 1;


            const { name, id, sprites, types } = response.data;

            const infoCard = {
                nome: name,
                code: id,
                image: sprites.other.dream_world.front_default,
                type: types[0].type.name,

            }

            if (infoCard.image) {
                createCardPokemons(infoCard.nome, infoCard.code, infoCard.image, infoCard.type);
            }


            const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

            cardPokemon.forEach(card => {
                card.addEventListener('click', openDetailsPokemon)
            })

        })
        .catch((error) => {
            if (error.response) {
                areaPokemons.innerHTML = "";
                btnLoadMore.style.display = 'none';
                countPokemons.textContent = 0;
                alert('Não foi encontrado nenhum resultado para essa pesquisa!');
            }
        })
}

btnSearch.addEventListener('click', searchPokemon);

inputSearch.addEventListener('keyup', (event) => {
    if (event.code == 'Enter') {
        searchPokemon();
    }
})