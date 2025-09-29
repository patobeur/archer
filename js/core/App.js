import * as THREE from 'three';

import { _game } from './Game.js';
import { _uiManager } from '../ui/UIManager.js';
import { _move } from '../game/PlayerMovement.js';
import { _cibles } from '../game/Targets.js';
import { _arrows } from '../game/Arrows.js';
import { _createStars } from '../world/Stars.js';
import { _board } from '../ui/ScoreBoard.js';
import { _score } from '../game/ScoreManager.js';
import { _createClouds } from '../world/Clouds.js';
import { _populateNature } from '../world/generation/NatureGenerator.js';
import { _populateForest } from '../world/generation/ForestGenerator.js';
import { config } from '../config/gameConfig.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { _scene } from './Scene.js';
import { LandingPage } from '../ui/LandingPage.js';
import { InGameMenu } from '../ui/InGameMenu.js';

const App = {
    gravity: new THREE.Vector3(0, -0.1, 0),
    createClouds: undefined,
    Font: undefined,
    selectedBow: undefined,
    isPlayerOutOfBounds: false,
    recenterCamera: false,

    init: function () {
        console.log('[App.js] App.init() called');
        _uiManager.init(this);
        LandingPage.init(this);

        const loader = new FontLoader();
        loader.load(
            'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json',
            (font) => {
                this.Font = font;
                console.log('Font loading ok');
                LandingPage.enableStartButton();
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the font:', error);
                const startButton = document.getElementById('startButton');
                if(startButton) startButton.innerHTML = 'Error';
            }
        );
    },

    start: function () {
        const sceneContainer = document.getElementById('scene-container');
        if (!sceneContainer) {
            console.error('Scene container not found!');
            return;
        }
        sceneContainer.style.display = 'block';

        _board.init(
            'Archer',
            { scoreBoard: false, bestScoreBoard: false },
            '.points-animation{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ffcc00;font-size:24px;font-weight:bold;animation:fade-up 2s ease-out forwards;z-index:20;text-shadow:1px 1px 2px black;}@keyframes fade-up{from{opacity:1;transform:translate(-50%,-50%) scale(1);}to{opacity:0;transform:translate(-50%,-150%) scale(1.5);}}'
        );
        _score.init();
        _scene.init(sceneContainer);
        _move.init(this, _scene);
        _cibles.init(_scene);

        if (config.environment === 'forest') {
            _populateForest.init(_scene.scene);
        } else {
            _populateNature.init(_scene.scene);
        }

        _arrows.init(this, _scene, _cibles, _score, this.gravity, this.Font, this.selectedBow);
        _createStars(_scene.scene, 2000, 800);
        this.createClouds = new _createClouds(_scene.scene, _scene.camera);

        const discGeometry = new THREE.BoxGeometry(1, 1, 1);
        const discMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000 });
        const disc = new THREE.Mesh(discGeometry, discMaterial);
        disc.position.y = 0.5;
        disc.userData = { points: 10 };
        disc.castShadow = true;
        disc.receiveShadow = true;
        _scene.scene.add(disc);
        _arrows.addCible(disc);

        _uiManager.createCrosshair();
        _uiManager.createWarningMessage();
        InGameMenu.init(this);

        _game.init(this);
        _game.start();
    },
};

App.init();