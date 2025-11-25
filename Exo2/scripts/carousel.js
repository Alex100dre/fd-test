// Si c'était à refaire, j'aurais plutôt suivi cet article... https://developer.chrome.com/blog/accessible-carousel?hl=fr
// Malheureusement, je manque de temps...
const DEFAULT_GAP = 16
const DIRECTION_LEFT = -1
const DIRECTION_RIGHT = 1

/**
 * Calcule la largeur de scroll (largeur d'une carte + gap)
 * @param {HTMLElement} track - L'élément contenant les cartes
 * @param {NodeList} cards - Liste des cartes du carrousel
 * @returns {number} La distance de scroll en pixels
 */
const calculateScrollAmount = (track, cards) => {
  if (!cards || cards.length === 0) return 0;

  const card = cards[0];
  const cardWidth = card.offsetWidth;
  const gap = parseInt(window.getComputedStyle(track).gap) || DEFAULT_GAP;
  return cardWidth + gap;
};

/**
 * Effectue le scroll du carrousel dans une direction donnée
 * @param {HTMLElement} track - L'élément à scroller
 * @param {number} direction - Direction du scroll (-1 pour gauche, 1 pour droite)
 * @param {number} scrollAmount - Distance de scroll en pixels
 */
const scrollCarousel = (track, direction, scrollAmount) => {
  track.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
};

/**
 * Met à jour l'état (disabled) des boutons de navigation en fonction de la position du scroll
 * @param {HTMLElement} track - L'élément scrollable
 * @param {HTMLButtonElement} prevButton - Bouton précédent
 * @param {HTMLButtonElement} nextButton - Bouton suivant
 */
const updateControlsAvailability = (track, prevButton, nextButton) => {
  const maxScroll = track.scrollWidth - track.clientWidth;
  const isAtStart = track.scrollLeft <= 0;
  const isAtEnd = track.scrollLeft >= maxScroll - 1;

  prevButton.disabled = isAtStart;
  nextButton.disabled = isAtEnd;
};

/**
 * Configure les événements de navigation par boutons
 * @param {HTMLElement} track - L'élément scrollable
 * @param {HTMLElement} prevButton - Bouton précédent
 * @param {HTMLElement} nextButton - Bouton suivant
 * @param {NodeList} cards - Liste des cartes du carrousel
 */
const setupControls = (track, prevButton, nextButton, cards) => {
  prevButton.addEventListener('click', () => {
    const scrollAmount = calculateScrollAmount(track, cards);
    scrollCarousel(track, DIRECTION_LEFT, scrollAmount);
  });

  nextButton.addEventListener('click', () => {
    const scrollAmount = calculateScrollAmount(track, cards);
    scrollCarousel(track, DIRECTION_RIGHT, scrollAmount);
  });
};

/**
 * Configure la navigation au clavier pour l'accessibilité
 * @param {HTMLElement} track - L'élément scrollable
 * @param {NodeList} cards - Liste des cartes du carrousel
 */
const setupKeyboardNavigation = (track, cards) => {
  track.setAttribute('tabindex', '0');

  track.addEventListener('keydown', (e) => {
    const scrollAmount = calculateScrollAmount(track, cards);
    let direction = 0;

    if (e.key === 'ArrowLeft') {
      direction = DIRECTION_LEFT;
    } else if (e.key === 'ArrowRight') {
      direction = DIRECTION_RIGHT;
    }

    if (direction !== 0) {
      e.preventDefault();
      scrollCarousel(track, direction, scrollAmount);
    }
  });
};

/**
 * Configure les événements de mise à jour de l'état (disabled) des boutons
 * @param {HTMLElement} track - L'élément scrollable
 * @param {HTMLElement} prevButton - Bouton précédent
 * @param {HTMLElement} nextButton - Bouton suivant
 */
const setupControlsAvailabilityListeners = (track, prevButton, nextButton) => {
  const updateAvailability = () => updateControlsAvailability(track, prevButton, nextButton);

  updateAvailability();

  track.addEventListener('scroll', updateAvailability);
  window.addEventListener('resize', updateAvailability);
};

/**
 * Initialise un carrousel avec tous ses événements
 * @param {HTMLElement} carousel - L'élément carrousel à initialiser
 */
const initCarousel = (carousel) => {
  const track = carousel.querySelector('.carousel__content');
  const prevButton = carousel.querySelector('.carousel__nav--prev');
  const nextButton = carousel.querySelector('.carousel__nav--next');
  const cards = carousel.querySelectorAll('.carousel__card');

  if (!track || !prevButton || !nextButton || cards.length === 0) {
      console.warn('[Carousel] Il manque des éléments nécessaires.');
    return;
  }

  setupControls(track, prevButton, nextButton, cards);
  setupKeyboardNavigation(track, cards);
  setupControlsAvailabilityListeners(track, prevButton, nextButton);
};

/**
 * Initialise tous les carrousels de la page
 */
const initAllCarousels = () => {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(initCarousel);
};

document.addEventListener('DOMContentLoaded', initAllCarousels);
