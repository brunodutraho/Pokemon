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
                const { name, id, sprites,types } = response.data;
                
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
