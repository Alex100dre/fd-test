# Synthèse
[Consulter le rendu en ligne](https://fd-test.le-dev.com) (si c'est pas accessible c'est que j'ai pas eu le temps de déployer 🥹)

Sur cet exercice, je me suis concentré sur l'HTML CSS étant un exercice d'integration avant tout et l'exo 1 ayant déjà pour but de tester mes capacités en développement JS.

## Approche générale et choix techniques

### 1. Langue du document & cohérence éditoriale

J’ai décidé de rédiger tout le contenu textuel en français, afin de pouvoir définir un html lang="fr" cohérent sur l’ensemble de la page.
Le validateur W3C fait toutefois remonter un avertissement concernant l’utilisation de Lorem ipsum dans un document déclaré en français. J’en ai bien pris note, mais dans le cadre d’un exercice, où les paragraphes ne servent qu’à remplir, j’ai jugé qu’il n’était pas pertinent de réécrire des blocs de texte purement décoratifs.

### 2. Avertissements W3C concernant l’accessibilité & roles ARIA

Un second avertissement concerne l’utilisation du rôle navigation sur l’élément <nav>.
Bien que ce rôle soit redondant en HTML5, certaines ressources (dont plusieurs fils Stack Overflow) précisent que cela reste utile pour certains anciens navigateurs ou certaines liseuses, et que l’ajout n’est pas problématique.
J’ai donc choisi d’assumer cette redondance dans un souci de compatibilité élargie.

⸻

## Gestion des assets & optimisation des images

J'ai préféré ne pas dépendre de sources externes comme des CDN pour pouvoir développer en hors ligne.
J’ai téléchargé toutes les polices et les images (photos, illustrations, fonds) afin de pouvoir les manipuler localement.
Par manque de temps, je n’ai pas pu réaliser toutes les optimisations prévues (standardisation des dimensions, déclinaisons mobiles, compression fine, etc.), mais j’ai tout de même pris la décision de convertir l’ensemble en WebP, un format plus léger que PNG/JPEG (après quelques recherche, il y a le format AVIF qui semble encore plus optimisé).

C’est une optimisation simple, rapide, et déjà bénéfique, même si l’optimisation complète aurait nécessité plus de travail.

⸻

## Accessibilité & choix colorimétriques

### 1. Problèmes initialement présents dans la maquette

La maquette fournie comportait plusieurs problèmes de contraste, notamment :
- les tags de catégorie des cartes,
- certains textes (dont le copyright du footer) affichés en gris clair sur gris clair.

### 2. Ajustements apportés

Pour les tags, j’avais deux options :
- assombrir fortement toutes les couleurs → mais cela rendait les catégories trop similaires,
- ou revoir légèrement le design.

J’ai donc choisi :
- d’utiliser une couleur de fond associée à chaque catégorie,
- d’assurer un contraste suffisant pour atteindre les recommandations d’accessibilité (selon l’inspecteur Chrome).

Même logique pour le footer : j’ai changé le gris pour atteindre un ratio lisible.

Ces écarts par rapport à la maquette sont assumés, car ils améliorent objectivement l’accessibilité.

⸻

## SEO & bonnes pratiques supplémentaires

Lors d’un audit rapide Lighthouse, un conseil récurrent concernait l’absence de balise `<meta name="description">`.
Comme l’ajout est trivial et bénéfique pour le SEO, j’ai ajouté cette balise afin d’améliorer le score global et respecter ces bonnes pratiques.

⸻

## Responsive design & structure CSS

### 1. Mobile First

J’ai suivi une approche mobile first.
Le fluid/responsive repose principalement sur :
- des tailles relatives (%, rem, vw, vh),
- une mise en page "fluid" avant d'être "responsive",
- assez peu de media queries, car la maquette s’y prêtait.

### 2. Utilisation de SASS

L’énoncé autorisait l’usage d’un préprocesseur : j’ai donc choisi SASS, qui m’a permis :
- d’utiliser des variables (couleurs, tailles, typographie...),
- de structurer mes fichiers proprement,
- d’imbrquer mes sélecteurs de manière lisible,
- d’éviter la répétition de classes dans les selecteurs.

### 3. Méthodologie BEM

L'exercice recommandait l'utilisation d'une méthodologie CSS, j’ai utilisé la convention BEM pour le nommage.

⸻

## Ce que j’aurais amélioré avec plus de temps
- Optimisation poussée des images : resizing, variantes mobiles, compression étagée.
- Refonte du carousel : j’ai découvert après coup un [excellent article de Chrome for Developers](https://developer.chrome.com/blog/accessible-carousel?hl=fr) présentant une méthode propre pour créer un carousel accessible 100% HTML/CSS, sans JavaScript.
Si c’était à refaire, je suivrais cette approche plus moderne et légère. (ça faisait longtemps que je n'avais pas codé un carousel from scratch et à l'époque le faire en pure HTML CSS était contreproductif comparé au JS)