import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const _populateForest = {
    init: function(scene) {
        console.log('[populate_forest.js] Initializing procedural forest...');

        const loader = new GLTFLoader();
        const modelUrl = './assets/3dObjects/Forest.glb';

        loader.load(modelUrl, (gltf) => {
            const treeTemplates = gltf.scene.children.filter(child => child.isMesh || child.isGroup);

            if (treeTemplates.length > 0) {
                console.log(`[populate_forest.js] Found ${treeTemplates.length} tree templates.`);

                // Pre-process templates to find their vertical offset
                const processedTemplates = treeTemplates.map(template => {
                    const box = new THREE.Box3().setFromObject(template);
                    const verticalOffset = -box.min.y;
                    return { template, verticalOffset };
                });

                // Detach templates from the loaded scene
                while(gltf.scene.children.length > 0){
                    gltf.scene.remove(gltf.scene.children[0]);
                }

                this.generateForest(scene, processedTemplates);
            } else {
                console.error('[populate_forest.js] No suitable tree templates found in the GLB file.');
            }

        }, undefined, (error) => {
            console.error('[populate_forest.js] Error loading GLB model:', error);
        });
    },

    generateForest: function(scene, processedTemplates) {
        const numberOfTrees = 200;
        const areaSize = 300;
        const exclusionRadius = 20; // Don't place trees in the center where the player starts

        for (let i = 0; i < numberOfTrees; i++) {
            // 1. Select a random processed template
            const { template, verticalOffset } = processedTemplates[Math.floor(Math.random() * processedTemplates.length)];

            // 2. Clone the template. Use `true` for a deep clone.
            const tree = template.clone(true);

            // 3. Set random non-uniform scale for more natural-looking trees
            const baseScale = 4.0 + Math.random() * 3.0; // Significantly larger scale: 4.0 to 7.0
            const heightVariation = 0.8 + Math.random() * 0.4; // Taller or shorter trees
            const widthVariation = 0.9 + Math.random() * 0.2;  // Wider or narrower trees

            const scaleX = baseScale * widthVariation;
            const scaleY = baseScale * heightVariation;
            const scaleZ = baseScale * widthVariation;

            tree.scale.set(scaleX, scaleY, scaleZ);

            // 4. Set random position, avoiding the center
            let x, z;
            do {
                x = (Math.random() - 0.5) * areaSize;
                z = (Math.random() - 0.5) * areaSize;
            } while (Math.sqrt(x*x + z*z) < exclusionRadius);

            // 5. Adjust Y position to place the base of the tree on the ground (y=0)
            const finalY = verticalOffset * scaleY;
            tree.position.set(x, finalY, z);

            // 6. Set random rotation (around the Y axis)
            tree.rotation.y = Math.random() * Math.PI * 2;

            // 7. Ensure shadows are enabled for all meshes in the cloned object
            tree.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // 8. Add to the main scene
            scene.add(tree);
        }

        console.log(`[populate_forest.js] Generated a forest with ${numberOfTrees} trees.`);
    }
};

export { _populateForest };