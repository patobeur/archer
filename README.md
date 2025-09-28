# Archer : Un jeu de tir à l'arc en 3D

Ce projet est un jeu de tir à l'arc en 3D à la première personne où le joueur peut tirer des flèches sur des cibles.

## Technologies utilisées

-  **Three.js** : Le cœur du projet est construit avec Three.js, une bibliothèque graphique 3D populaire pour JavaScript.
-  **Modules ES6** : Le code est organisé en modules ES6, qui sont chargés directement dans le navigateur.
-  **CDN pour Three.js** : Au lieu d'utiliser une copie locale, le projet charge Three.js et ses addons depuis le CDN `unpkg.com`, comme défini dans `index.html`.

## Structure du projet

Le projet est organisé dans les répertoires et fichiers suivants :

-  `index.html` : Le point d'entrée principal de l'application. Il configure le document HTML et charge les scripts nécessaires.
-  `js/` : Ce répertoire contient tout le code JavaScript du jeu.
   -  `archer/` : Ce sous-répertoire contient la logique principale du jeu.
      -  `archer.js` : Le fichier central qui initialise le jeu, configure la scène et gère la boucle de jeu.
   -  `3d/lib/` : Ce sous-répertoire contient les modules responsables de la création des objets 3D dans le jeu.
      -  `cibles.js` : Crée les cibles de manière programmatique.
      -  `arrows5.js` : Crée les flèches de manière programmatique et gère leur physique.
      -  `nuages2.js` : Crée les nuages de manière programmatique.
      -  `stars.js` : Crée le fond étoilé.
   -  `board.js` : Gère les éléments de l'interface utilisateur, comme le tableau des scores.
   -  `front.js` : Un module utilitaire pour créer et manipuler les éléments du DOM.
   -  `move.js` : Gère les déplacements du joueur et les contrôles de la caméra.
   -  `score.js` : Gère le score du joueur.
-  `assets/` : Ce répertoire contient les ressources statiques comme les images et les fichiers son.

## Aperçu de l'architecture

La logique principale du jeu est initiée dans `js/archer/archer.js`, qui est chargé comme un module dans `index.html`. Le script est chargé à la fin de la balise `<body>` pour s'assurer que le DOM est entièrement disponible lorsque le script s'exécute.

### Chargement des ressources

Le jeu charge les ressources suivantes :

-  **Police** : Une police de caractères est chargée depuis un CDN pour être utilisée dans les géométries textuelles.
-  **Son** : Un fichier audio pour l'effet sonore de la flèche est chargé depuis le répertoire `assets`.
-  **Images** : Une image SVG pour l'indicateur de direction du vent est chargée depuis le répertoire `assets`.

Toutes les importations liées aux chargeurs de modèles 3D externes (par exemple, `OBJLoader`, `GLTFLoader`) sont considérées comme du code hérité et ne sont pas utilisées dans la version actuelle du jeu. C'est une considération importante pour le développement futur.

# Archer: A 3D Archery Game

This project is a first-person 3D archery game where the player can shoot arrows at targets.

## Technologies Used

-  **Three.js**: The core of the project is built with Three.js, a popular 3D graphics library for JavaScript.
-  **ES6 Modules**: The codebase is organized using ES6 modules, which are loaded directly in the browser.
-  **CDN for Three.js**: Instead of using a local copy, the project loads Three.js and its add-ons from the `unpkg.com` CDN, as defined in `index.html`.

## Project Structure

The project is organized into the following directories and files:

-  `index.html`: The main entry point of the application. It sets up the HTML document and loads the necessary scripts.
-  `js/`: This directory contains all the JavaScript code for the game.
   -  `archer/`: This subdirectory contains the main game logic.
      -  `archer.js`: The central file that initializes the game, sets up the scene, and manages the game loop.
   -  `3d/lib/`: This subdirectory contains the modules responsible for creating the 3D objects in the game.
      -  `cibles.js`: Creates the targets programmatically.
      -  `arrows5.js`: Creates the arrows programmatically and manages their physics.
      -  `nuages2.js`: Creates the clouds programmatically.
      -  `stars.js`: Creates the starfield background.
   -  `board.js`: Manages the UI elements, such as the scoreboard.
   -  `front.js`: A utility module for creating and manipulating DOM elements.
   -  `move.js`: Handles player movement and camera controls.
   -  `score.js`: Manages the player's score.
-  `assets/`: This directory contains static assets like images and sound files.

## Architecture Overview

The main game logic is initiated in `js/archer/archer.js`, which is loaded as a module in `index.html`. The script is loaded at the end of the `<body>` to ensure that the DOM is fully available before the script executes.

### Asset Loading

The game loads the following assets:

-  **Font**: A font is loaded from a CDN for use in text-based geometries.
-  **Sound**: An audio file for the arrow sound effect is loaded from the `assets` directory.
-  **Images**: An SVG image for the wind direction indicator is loaded from the `assets` directory.

Any imports related to external 3D model loaders (e.g., `OBJLoader`, `GLTFLoader`) are considered legacy code and are not used in the current version of the game. This is an important consideration for future development.
