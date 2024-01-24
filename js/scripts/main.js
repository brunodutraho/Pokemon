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

function primeiraLetraMaiuscula(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);

}

function createCardPokemons(nome, code, imagePoke, type) {
    let card = document.createElement('button');
    card.classList = `card-pokemon js-open-details-pokemon ${type}`
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
            const countPokemons = document.getElementById('js-count-pokemons');

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
    const countPokemonsType = document.getElementById('js-count-pokemons')
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
                countPokemonsType.textContent = pokemon.length;
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
