import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const _populateForest = {
    init: function(scene) {
        console.log('[populate_forest.js] Initializing forest...');

        const loader = new GLTFLoader();
        const modelUrl = './assets/3dObjects/Forest.glb';

        loader.load(modelUrl, (gltf) => {
            const forest = gltf.scene;

            forest.position.set(0, 0, 0);

            forest.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(forest);
            console.log('[populate_forest.js] Forest model loaded and added to the scene.');

        }, undefined, (error) => {
            console.error('[populate_forest.js] Error loading GLB model:', error);
        });
    }
};

export { _populateForest };