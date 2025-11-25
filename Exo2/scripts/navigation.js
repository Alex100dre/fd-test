/**
 * Constantes de configuration
 */
const CONFIG = {
  NAV_OFFSET: 100,
  BOTTOM_THRESHOLD: 10,
  SCROLL_LOCK_DURATION: 1000
};

/**
 * État de la navigation
 */
const navigationState = {
  lockedSection: null,
  lockTimeout: null
};

/**
 * Vérifie si l'utilisateur est en bas de la page
 * @returns {boolean}
 */
const isAtBottomOfPage = () => {
  return (window.innerHeight + window.scrollY) >=
         document.documentElement.scrollHeight - CONFIG.BOTTOM_THRESHOLD;
};

/**
 * Récupère l'ID du footer s'il existe
 * @returns {string|null}
 */
const getFooterId = () => {
  const footer = document.getElementById('footer');
  return footer ? 'footer' : null;
};

/**
 * Trouve la section visible selon la position de scroll
 * @param {NodeList} sections - Liste des sections du document
 * @param {number} scrollPosition - Position de scroll ajustée
 * @returns {string|null}
 */
const findVisibleSection = (sections, scrollPosition) => {
  for (const section of sections) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      return section.id;
    }
  }
  return null;
};

/**
 * Annule le timeout de déverrouillage en cours s'il existe
 */
const clearLockTimeout = () => {
  if (navigationState.lockTimeout) {
    clearTimeout(navigationState.lockTimeout);
    navigationState.lockTimeout = null;
  }
};

/**
 * Déverrouille la section actuellement verrouillée
 */
const unlockSection = () => {
  navigationState.lockedSection = null;
  navigationState.lockTimeout = null;
};

/**
 * Programme le déverrouillage automatique après la durée configurée
 */
const scheduleUnlock = () => {
  navigationState.lockTimeout = setTimeout(unlockSection, CONFIG.SCROLL_LOCK_DURATION);
};

/**
 * Définit la section actuellement verrouillée
 * @param {string} sectionId - ID de la section à verrouiller
 */
const setLockedSection = (sectionId) => {
  navigationState.lockedSection = sectionId;
};

/**
 * Verrouille temporairement une section comme active
 * @param {string} sectionId - ID de la section à verrouiller
 */
const lockSection = (sectionId) => {
  clearLockTimeout();
  setLockedSection(sectionId);
  scheduleUnlock();
};

/**
 * Détermine quelle section est actuellement active
 * @returns {string|null}
 */
const getCurrentSection = () => {
  // Si une section est verrouillée (clic récent), la retourner en priorité
  if (navigationState.lockedSection) {
    return navigationState.lockedSection;
  }

  // Prioriser le footer si on est en bas de page
  if (isAtBottomOfPage()) {
    return getFooterId();
  }

  // Sinon, trouver la section visible
  const sections = document.querySelectorAll('section[id], footer[id]');
  const scrollPosition = window.scrollY + CONFIG.NAV_OFFSET;
  return findVisibleSection(sections, scrollPosition);
};

/**
 * Met à jour l'état actif/inactif d'un lien de navigation
 * @param {Element} link - Élément lien de navigation
 * @param {string|null} currentSection - ID de la section actuellement active
 */
const updateLinkState = (link, currentSection) => {
  const href = link.getAttribute('href');

  if (!href || !href.startsWith('#')) {
    return;
  }

  const targetId = href.substring(1);
  const isActive = targetId === currentSection;

  link.classList.toggle('nav__link--active', isActive);
};

/**
 * Met à jour tous les liens de navigation
 * @param {string|null} currentSection - ID de la section actuellement active
 */
const updateAllNavLinks = (currentSection) => {
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => updateLinkState(link, currentSection));
};

/**
 * Met à jour le lien de navigation actif en fonction de la section visible
 */
const updateActiveNavLink = () => {
  const currentSection = getCurrentSection();
  updateAllNavLinks(currentSection);
};

/**
 * Gère le clic sur un lien de navigation
 * @param {Event} event - Événement de clic
 */
const handleNavLinkClick = (event) => {
  const link = event.currentTarget;
  const href = link.getAttribute('href');

  if (!href || !href.startsWith('#')) {
    return;
  }

  const targetId = href.substring(1);

  lockSection(targetId);

  updateAllNavLinks(targetId);
};

/**
 * Attache les gestionnaires d'événements aux liens de navigation
 */
const attachNavLinkListeners = () => {
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
  });
};

/**
 * Initialise la détection de section active
 */
const initActiveNavigation = () => {
  updateActiveNavLink();
  attachNavLinkListeners();

  window.addEventListener('scroll', updateActiveNavLink);
  window.addEventListener('resize', updateActiveNavLink);
};

document.addEventListener('DOMContentLoaded', initActiveNavigation);
