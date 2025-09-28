import * as THREE from 'three';

import { _move } from '../move.js';
import { _cibles } from '../3d/lib/cibles.js';
import { _arrows } from '../3d/lib/arrows5.js';
import { _createStars } from '../3d/lib/stars.js';
import { _board } from '../board.js';
import { _score } from '../score.js';
import { _front } from '../front.js';
import { _createClouds  } from '../3d/lib/nuages2.js';
import { _populateNature } from '../modules/populate_nature.js';
import { _populateForest } from '../modules/populate_forest.js';
import { config } from '../config.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import { _scene } from './scene.js';

import Stats from 'three/addons/libs/stats.module.js';

let game = {
    raycaster: new THREE.Raycaster(),
    gravity: new THREE.Vector3(0, -0.1, 0),
    stats: new Stats(),
    clock: new THREE.Clock(),
    delta: 0,
    createClouds:undefined,
    Font:undefined,
    selectedBow: undefined,
    init:function(){
        console.log('[archer.js] game.init() called');

        const startButton = document.getElementById('startButton');
        if (!startButton) {
            console.error('Start button not found!');
            return;
        }

        startButton.disabled = true;
        startButton.innerHTML = 'Loading...';

        console.log('loading Font');
        const loader = new FontLoader();
        loader.load(
            'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json',
            (font) => {
                this.Font = font;
                console.log('Font loading ok');

                startButton.disabled = false;
                startButton.innerHTML = 'Start';
                startButton.addEventListener('click', () => {
                    this.showBowSelection();
                }, { once: true });
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the font:', error);
                startButton.innerHTML = 'Error';
            }
        );
    },
    showBowSelection: function() {
        const navbar = document.getElementById('navbar');
        if(navbar) {
            navbar.style.display = 'none';
        }

        const bowSelectionContainer = _front.createDiv({
            attributes: { id: 'bowSelection' },
            style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '20px',
                borderRadius: '10px',
                zIndex: '20'
            }
        });
        document.body.appendChild(bowSelectionContainer);

        const title = _front.createDiv({
            tag: 'h2',
            attributes: { innerHTML: 'Choose Your Bow' },
            style: { color: 'white' }
        });
        bowSelectionContainer.appendChild(title);

        Object.keys(config.bows).forEach(bowKey => {
            const bow = config.bows[bowKey];
            const bowButton = _front.createDiv({
                tag: 'button',
                attributes: {
                    innerHTML: `${bowKey.charAt(0).toUpperCase() + bowKey.slice(1)} (Power: ${bow.power})`
                },
                style: {
                    margin: '10px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }
            });

            bowButton.addEventListener('click', () => {
                this.selectedBow = bow;
                document.body.removeChild(bowSelectionContainer);
                this.next2();
            });

            bowSelectionContainer.appendChild(bowButton);
        });
    },
    next2:function(){
        const sceneContainer = document.getElementById('scene-container');
        if (!sceneContainer) {
            console.error('Scene container not found!');
            return;
        }

        _board.init(
            'Archer',
            {scoreBoard:true,bestScoreBoard:true},
            '*{margin:0;padding:0;box-sizing: border-box;}'+
            'body{background-color: rgb(190, 190, 190);}'+
            '.container{width:100%;height:100%;position:absolute;overflow:hidden;z-index:2;margin:0;padding:0;box-sizing:border-box;}'+
            '.top-bar{display:flex;justify-content:space-between;padding:10px;background-color:rgba(0,0,0,0.5);color:white;width:100%;position:absolute;top:0;left:0;z-index:10;}'+
            '.score,.bestscore{font-size:16px;font-weight:bold;background-color:rgba(1, 12, 21, 0.75);color:rgb(169, 231, 255);padding:5px;border-radius:9px;}'+
            '@media (max-width: 600px) {'+
            '.top-bar{flex-direction:column;align-items:center;}'+
            '.score,.bestscore{margin-bottom:5px;}'+
            '}'+
            '.points-animation{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ffcc00;font-size:24px;font-weight:bold;animation:fade-up 2s ease-out forwards;z-index:20;text-shadow:1px 1px 2px black;}'+
            '@keyframes fade-up{from{opacity:1;transform:translate(-50%,-50%) scale(1);}to{opacity:0;transform:translate(-50%,-150%) scale(1.5);}}'
        )
        _score.init()
        _scene.init(sceneContainer)
        _move.init(_scene)
        _cibles.init(_scene)

        if (config.environment === 'forest') {
            _populateForest.init(_scene.scene);
        } else {
            _populateNature.init(_scene.scene);
        }

        _arrows.init(_scene,_cibles,_score,this.gravity,this.Font, this.selectedBow)

        this.stats.dom.style.top = 'initial'
        this.stats.dom.style.bottom = '0'
        document.body.appendChild(this.stats.dom);

        _createStars(_scene.scene, 2000, 800);
        this.createClouds = new _createClouds(_scene.scene, _scene.camera);


                        const discGeometry = new THREE.BoxGeometry(1,1,1);
                        const discMaterial = new THREE.MeshStandardMaterial({color: 0x000000,emissive: 0x000000} );
                        const disc = new THREE.Mesh(discGeometry, discMaterial);
                        disc.position.y = 0.5;
                        disc.userData = { points: 10 };
                        disc.castShadow = true
                        disc.receiveShadow = true;
                        _scene.scene.add(disc);
                        _arrows.addCible(disc)


        // Animate
        this.animate();

        let mire = _front.createDiv({
            style:{backgroundColor:"black",position:'absolute',top:"calc( 50% - 1px)",left:"calc( 50% - 1px)",width:"4px",height:"4px", zIndex: "30"}
        })
        document.body.append(mire)
    },
    animate:function(){
        game.delta = game.clock.getDelta();
        requestAnimationFrame(game.animate);
        _move.updatePlayerMovement();
        _move.updateCameraRotation();
        _arrows.checkArrows();
        _arrows.updateWind();
        _scene.renderer.render(_scene.scene, _scene.camera);
        game.stats.update();
        game.createClouds.update();
    },
}
game.init()