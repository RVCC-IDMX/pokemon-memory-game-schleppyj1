/**
 * Main Application Logic - Simplified Version
 * This file contains the main functionality for the Pokemon Card Flip App
 */
import { PokemonService } from './pokemon.js';

// DOM Elements
const cardGrid = document.getElementById('card-grid');
const loadingSpinner = document.getElementById('loading-spinner');

// Constants
const CARD_COUNT = 12;

// Application State
let cards = [];

// Debug flag - set to true to simulate slower loading
const DEBUG_SHOW_SPINNER = false;
const LOADING_DELAY = 4000; // 2 seconds delay

/**
 * Initialize the application
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function | MDN: async function}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event | MDN: DOMContentLoaded}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/classList | MDN: classList}
 */
async function initApp() {
  // Show loading spinner
  showLoading();

  // Hide the card grid initially
  cardGrid.classList.add('hidden');

  // Create card elements
  createCardElements();

  // Fetch initial Pokemon data
  await fetchAndAssignPokemon();

  // Set up event listeners
  setupEventListeners();

  // Hide loading spinner and show cards
  hideLoading();
  cardGrid.classList.remove('hidden');
}

/**
 * Create card elements in the grid
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement | MDN: createElement}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML | MDN: innerHTML}
 */
function createCardElements() {
  // Clear existing cards
  cardGrid.innerHTML = '';
  cards = [];

  // Create new cards
  for (let i = 0; i < CARD_COUNT; i++) {
    const card = createCardElement(i);
    cardGrid.appendChild(card);
    cards.push(card);
  }
}

/**
 * Create a single card element
 * @param {number} index - Card index
 * @returns {HTMLElement} Card element
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset | MDN: dataset}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild | MDN: appendChild}
 */
function createCardElement(index) {
  // Create card elements
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.index = index;

  const cardInner = document.createElement('div');
  cardInner.className = 'card-inner';

  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';

  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';

  // Add Pokeball image to front
  const pokeballImg = document.createElement('img');
  pokeballImg.src = '/assets/pokeball.png';
  pokeballImg.alt = 'red and white Pokéball';
  pokeballImg.className = 'pokeball-img';
  cardFront.appendChild(pokeballImg);

  // Assemble card
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  return card;
}

/**
 * Fetch and assign Pokemon to cards
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch | MDN: try...catch}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise | MDN: Promise}
 */
async function fetchAndAssignPokemon() {

  try {
    const pokemonList = await PokemonService.fetchMultipleRandomPokemon(6);

    // Used map and spread operator
    const pokemonPairs = pokemonList.flatMap((num) => ([num, num]));

    const shuffledPairs = shuffleArray(pokemonPairs);

    // Assign Pokémon to cards - use a more robust approach with error checking
    for (let i = 0; i < Math.min(CARD_COUNT, shuffledPairs.length); i++) {
      if (cards[i] && shuffledPairs[i]) {
        assignPokemonToCard(cards[i], shuffledPairs[i]);
      }
    }
  } catch (error) {
    console.error('Error fetching and assigning Pokemon:', error);
    // Consider adding user-friendly error handling here
    showErrorMessage('Failed to load Pokémon. Please try refreshing the page.');
  }
}

function shuffleArray(array) {

  // Create a deep copy of the array to avoid modifying the original
  const arrayCopy = structuredClone(array);

  // Implement shuffling on the copy (minimum requirement: use sort with random function)
  // For extra credit: implement the Fisher-Yates shuffle algorithm
  arrayCopy.sort(() => Math.random() - 0.5);

  return arrayCopy;
}

/**
 * Assign a Pokemon to a card
 * @param {HTMLElement} card - Card element
 * @param {Object} pokemon - Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify | MDN: JSON.stringify}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector | MDN: querySelector}
 */
function assignPokemonToCard(card, pokemon) {
  if (!card || !pokemon) {
    return;
  }

  // Store Pokemon data in card dataset
  card.dataset.pokemon = JSON.stringify(pokemon);

  // Get card back element
  const cardBack = card.querySelector('.card-back');

  // Clear existing content
  cardBack.innerHTML = '';

  // Create Pokemon elements
  const pokemonImg = document.createElement('img');
  pokemonImg.src = pokemon.sprite;
  pokemonImg.alt = pokemon.name;
  pokemonImg.className = 'pokemon-img';

  const pokemonName = document.createElement('h2');
  pokemonName.textContent = pokemon.name;
  pokemonName.className = 'pokemon-name';

  const pokemonTypes = document.createElement('div');
  pokemonTypes.className = 'pokemon-types';

  // Add type badges
  pokemon.types.forEach(type => {
    const typeBadge = document.createElement('span');
    typeBadge.textContent = type;
    typeBadge.className = `type-badge ${type}`;
    pokemonTypes.appendChild(typeBadge);
  });

  // Create stats section
  const pokemonStats = document.createElement('div');
  pokemonStats.className = 'pokemon-stats';

  // Add height stat
  const heightStat = document.createElement('div');
  heightStat.className = 'stat';
  heightStat.innerHTML = `<span>Height</span><span class="stat-value">${pokemon.height}m</span>`;

  // Add weight stat
  const weightStat = document.createElement('div');
  weightStat.className = 'stat';
  weightStat.innerHTML = `<span>Weight</span><span class="stat-value">${pokemon.weight}kg</span>`;

  // Add abilities count
  const abilitiesStat = document.createElement('div');
  abilitiesStat.className = 'stat';
  abilitiesStat.innerHTML = '<span>Abilities</span>' +
    `<span class="stat-value">${pokemon.abilities.length}</span>`;

  // Assemble stats
  pokemonStats.appendChild(heightStat);
  pokemonStats.appendChild(weightStat);
  pokemonStats.appendChild(abilitiesStat);

  // Assemble card back
  cardBack.appendChild(pokemonImg);
  cardBack.appendChild(pokemonName);
  cardBack.appendChild(pokemonTypes);
  cardBack.appendChild(pokemonStats);
}

/**
 * Handle card click
 * @param {Event} event - Click event
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event | MDN: Event}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */

// Use let for variables that will change
let firstSelectedCard = null;
let secondSelectedCard = null;
// Flag to prevent interaction during card processing
let isProcessingPair = false;

function handleCardClick(event) {

  // Find the clicked card using closest for better performance and readability
  const card = event.target.closest('.card');

  // Early return pattern for better readability
  if (!card) {
    return; // Not a card or child of card
  }


  // Guard clauses for better readability
  if (card.classList.contains('flipped') || card.classList.contains('matched')) {
    return; // Already flipped or matched
  }

  // Check if we're currently processing a pair (prevent clicking during timeout)
  if (isProcessingPair) {
    return;
  }

  // Flip the card
  card.classList.add('flipped');
  if (card === firstSelectedCard || card === secondSelectedCard) {
    return;
  }

  if (firstSelectedCard && secondSelectedCard) {
    return;
  }

  // Track selections
  if (!firstSelectedCard) {
    // First card selection
    firstSelectedCard = card;
  } else if (firstSelectedCard !== card) {
    // Second card selection
    secondSelectedCard = card;

    checkForMatch();
  }
}

function checkForMatch() {
  // Get Pokémon data from both cards with error handling
  let firstPokemonData, secondPokemonData;

  try {
    firstPokemonData = JSON.parse(firstSelectedCard.dataset.pokemon);
    secondPokemonData = JSON.parse(secondSelectedCard.dataset.pokemon);
  } catch (error) {
    console.error('Error parsing Pokémon data:', error);
    resetSelection();
    return;
  }

  // Guard clause if either data is missing
  if (!firstPokemonData || !secondPokemonData) {
    console.error('Missing Pokémon data');
    resetSelection();
    return;
  }

  // Used a constant time comparison with strict equality
  if (firstPokemonData.id === secondPokemonData.id) {
    handleMatch();
  } else {
    handleNonMatch();
  }
}

const matchedPairs = 0;
const TOTAL_PAIRS = 6;

function handleMatch() {
  firstSelectedCard.classList.add('matched');
  secondSelectedCard.classList.add('matched');
  resetSelection();
  checkGameCompletion();

}

function handleNonMatch() {
  // Set processing flag to prevent further interaction during timeout
  isProcessingPair = true;

  // Use a promise with setTimeout for better async handling
  return new Promise(resolve => {
    setTimeout(() => {
      // Flip cards back over
      firstSelectedCard.classList.remove('flipped');
      secondSelectedCard.classList.remove('flipped');

      // Reset selection after animation completes
      resetSelection();

      // Release the processing lock
      isProcessingPair = false;

      resolve();
    }, 1000); // 1 second delay
  });
}

function resetSelection() {
  firstSelectedCard = null;
  secondSelectedCard = null;
  isProcessingPair = false;

}

function checkGameCompletion() {
  // Used querySelectorAll to compare count vs total.
  const cardsFlipped = document.querySelectorAll('.matched').length;

  if (cardsFlipped === CARD_COUNT) {
    showGameComplete();
  }
}

function showGameComplete() {

  // 1. Create a container for the message
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('completion-message');

  // 2. Add the message content
  messageContainer.innerHTML = `
    <h2>Congratulations!</h2>
    <p>You found all the Pokémon pairs!</p>
    <button id="play-again">Play Again</button>
  `;

  // 3. Add to the page
  document.querySelector('.container').appendChild(messageContainer);

  // 4. Set up the play again button
  document.getElementById('play-again').addEventListener('click', () => {
    messageContainer.remove();
    resetGame();
  });
}

function resetGame() {
  initApp();
}

/**
 * Set up event listeners
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | MDN: addEventListener}
 */
function setupEventListeners() {
  // Card click event
  cardGrid.addEventListener('click', handleCardClick);
}

/**
 * Show loading spinner
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */
function showLoading() {
  loadingSpinner.classList.remove('hidden');
}

/**
 * Hide loading spinner
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */
function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
