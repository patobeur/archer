import * as THREE from 'three';

import { _move } from '../move.js';
import { _cibles } from '../3d/lib/cibles.js';
import { _arrows } from '../3d/lib/arrows5.js';
import { _createStars } from '../3d/lib/stars.js';
import { _board } from '../board.js';
import { _score } from '../score.js';
import { _front } from '../front.js';
import { _createClouds  } from '../3d/lib/nuages2.js';

import { _obj } from './datas/obj.js';
import { _textures } from './datas/textures.js';
import { _GLTFLoader, _TextureLoader } from '../3d/loaders.js';
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
    init:function(){
        console.log('loading Font')
        const loader = new FontLoader();
        loader.load('./node_modules_min/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            this.Font = font;
            console.log('Font loading ok')
            this.next1();
        })
    },
    next1:function(){
        this.next2();
    },
    next2:function(){
        _board.init(
            'Archer',
            {scoreBoard:true,bestScoreBoard:true},
            '*{margin:0;padding:0;box-sizing: border-box;}'+
            'body{background-color: rgb(190, 190, 190);}'+
            '.container{width:100%;height:100%;position:absolute;overflow:hidden;z-index:2;margin:0;padding:0;box-sizing:border-box;}'+
            '.score,.bestscore{position:absolute;font-size:16px;font-weight:bold;background-color:rgba(1, 12, 21, 0.75);color:rgb(169, 231, 255);padding:5px;border-radius:9px;}'+
            '.score{top:5px;left:5px;}'+
            '.bestscore{top:5px;right:5px;}'
        )
        _score.init()
        _scene.init()
        _move.init(_scene)
        _cibles.init(_scene)
        _arrows.init(_scene,_cibles,_score,this.gravity,this.Font)

        this.stats.dom.style.top = 'initial'
        this.stats.dom.style.bottom = '0'
        document.body.appendChild(this.stats.dom);

        _createStars(_scene.scene, 2000, 800);
        this.createClouds = new _createClouds(_scene.scene, _scene.camera);
        // _createClouds.init(_scene.scene, _scene.camera);
        
        
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
            style:{backgroundColor:"black",position:'absolute',top:"calc( 50% - 1px)",left:"calc( 50% - 1px)",width:"4px",height:"4px"}
        })
        document.body.append(mire)
    },
    animate:function(){
        game.delta = game.clock.getDelta();
        requestAnimationFrame(game.animate);
        _move.updatePlayerMovement(); 
        _arrows.checkArrows();
        _scene.renderer.render(_scene.scene, _scene.camera);
        game.stats.update();
        game.createClouds.update();
    },
}
game.init()