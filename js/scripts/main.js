const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
const closePokemon = document.querySelector('.js-close-modal-details-pokemon')
const closeOverlay = document.querySelector('.js-overlay-modal-details-pokemon')

function openDetailsPokemon() {
    document.documentElement.classList.add('open-modal');
}

function closeDetailsPokemon() {
    document.documentElement.classList.remove('open-modal');
}

cardPokemon.forEach(card => {
    card.addEventListener('click', openDetailsPokemon);
})

closePokemon.addEventListener('click', closeDetailsPokemon);
closeOverlay.addEventListener('click', closeDetailsPokemon);
