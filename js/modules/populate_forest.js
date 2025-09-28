import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const _populateForest = {
    init: function(scene) {
        console.log('[populate_forest.js] Initializing procedural forest...');

        const loader = new GLTFLoader();
        const modelUrl = './assets/3dObjects/Forest.glb';

        loader.load(modelUrl, (gltf) => {
            // We assume that each direct child of the scene is a tree model template.
            // This is more robust if trees are groups of meshes.
            const treeTemplates = gltf.scene.children.filter(child => child.isMesh || child.isGroup);

            if (treeTemplates.length > 0) {
                console.log(`[populate_forest.js] Found ${treeTemplates.length} tree templates.`);
                // We need to remove them from the original scene parent before using them as templates
                while(gltf.scene.children.length > 0){
                    gltf.scene.remove(gltf.scene.children[0]);
                }
                this.generateForest(scene, treeTemplates);
            } else {
                console.error('[populate_forest.js] No suitable tree templates found in the GLB file.');
            }

        }, undefined, (error) => {
            console.error('[populate_forest.js] Error loading GLB model:', error);
        });
    },

    generateForest: function(scene, treeTemplates) {
        const numberOfTrees = 200;
        const areaSize = 300;
        const exclusionRadius = 20; // Don't place trees in the center where the player starts

        for (let i = 0; i < numberOfTrees; i++) {
            // 1. Select a random tree template
            const template = treeTemplates[Math.floor(Math.random() * treeTemplates.length)];

            // 2. Clone the template. Use `true` for a deep clone.
            const tree = template.clone(true);

            // 3. Set random position, avoiding the center
            let x, z;
            do {
                x = (Math.random() - 0.5) * areaSize;
                z = (Math.random() - 0.5) * areaSize;
            } while (Math.sqrt(x*x + z*z) < exclusionRadius);

            tree.position.set(x, 0, z);

            // 4. Set random rotation (around the Y axis)
            tree.rotation.y = Math.random() * Math.PI * 2;

            // 5. Set random scale
            const scale = 0.8 + Math.random() * 0.4; // Scale from 0.8 to 1.2
            tree.scale.set(scale, scale, scale);

            // 6. Ensure shadows are enabled for all meshes in the cloned object
            tree.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // 7. Add to the main scene
            scene.add(tree);
        }

        console.log(`[populate_forest.js] Generated a forest with ${numberOfTrees} trees.`);
    }
};

export { _populateForest };