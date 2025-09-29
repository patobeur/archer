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

        const startButton = document.getElementById('startButton');
        if (!startButton) {
            console.error('Start button not found!');
            return;
        }

        startButton.disabled = true;
        startButton.innerHTML = 'Loading...';

        const loader = new FontLoader();
        loader.load(
            'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json',
            (font) => {
                this.Font = font;
                console.log('Font loading ok');
                _uiManager.enableStartButton();
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the font:', error);
                startButton.innerHTML = 'Error';
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
            { scoreBoard: true, bestScoreBoard: true },
            '*{margin:0;padding:0;box-sizing: border-box;}body{background-color: rgb(190, 190, 190);}.container{width:100%;height:100%;position:absolute;overflow:hidden;z-index:2;margin:0;padding:0;box-sizing:border-box;}.top-bar{display:flex;justify-content:space-between;padding:10px;background-color:rgba(0,0,0,0.5);color:white;width:100%;position:absolute;top:0;left:0;z-index:10;}.score,.bestscore{font-size:16px;font-weight:bold;background-color:rgba(1, 12, 21, 0.75);color:rgb(169, 231, 255);padding:5px;border-radius:9px;}@media (max-width: 600px) {.top-bar{flex-direction:column;align-items:center;}.score,.bestscore{margin-bottom:5px;}}.points-animation{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ffcc00;font-size:24px;font-weight:bold;animation:fade-up 2s ease-out forwards;z-index:20;text-shadow:1px 1px 2px black;}@keyframes fade-up{from{opacity:1;transform:translate(-50%,-50%) scale(1);}to{opacity:0;transform:translate(-50%,-150%) scale(1.5);}}'
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

        _game.init(this);
        _game.start();
    },
};

App.init();