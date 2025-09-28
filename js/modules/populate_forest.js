import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const _populateForest = {
    init: function(scene, targets = []) {
        console.log('[populate_forest.js] Initializing procedural forest with exclusion zones...');

        const loader = new GLTFLoader();
        const modelUrl = './assets/3dObjects/Forest.glb';

        loader.load(modelUrl, (gltf) => {
            const treeTemplates = gltf.scene.children.filter(child => child.isMesh || child.isGroup);

            if (treeTemplates.length > 0) {
                console.log(`[populate_forest.js] Found ${treeTemplates.length} tree templates.`);

                const processedTemplates = treeTemplates.map(template => {
                    const box = new THREE.Box3().setFromObject(template);
                    const verticalOffset = -box.min.y;
                    return { template, verticalOffset };
                });

                while(gltf.scene.children.length > 0){
                    gltf.scene.remove(gltf.scene.children[0]);
                }

                this.generateForest(scene, processedTemplates, targets);
            } else {
                console.error('[populate_forest.js] No suitable tree templates found in the GLB file.');
            }

        }, undefined, (error) => {
            console.error('[populate_forest.js] Error loading GLB model:', error);
        });
    },

    isPositionInExclusionZone: function(x, z, targets, playerPos, playerRadius, targetRadius, corridorWidth) {
        // 1. Check player exclusion zone
        if (Math.sqrt(Math.pow(x - playerPos.x, 2) + Math.pow(z - playerPos.z, 2)) < playerRadius) {
            return true;
        }

        // 2. Check zones for each target
        for (const target of targets) {
            const targetPos = { x: target.x, z: target.z };

            // Check target exclusion zone
            if (Math.sqrt(Math.pow(x - targetPos.x, 2) + Math.pow(z - targetPos.z, 2)) < targetRadius) {
                return true;
            }

            // Check corridor exclusion zone
            const vecPlayerToTarget = { x: targetPos.x - playerPos.x, z: targetPos.z - playerPos.z };
            const vecPlayerToTree = { x: x - playerPos.x, z: z - playerPos.z };
            const lenSqPlayerToTarget = vecPlayerToTarget.x * vecPlayerToTarget.x + vecPlayerToTarget.z * vecPlayerToTarget.z;

            if (lenSqPlayerToTarget === 0) continue;

            const dotProduct = vecPlayerToTree.x * vecPlayerToTarget.x + vecPlayerToTree.z * vecPlayerToTarget.z;

            // Check if the tree is longitudinally between the player and target
            if (dotProduct > 0 && dotProduct < lenSqPlayerToTarget) {
                const crossProduct = vecPlayerToTree.x * vecPlayerToTarget.z - vecPlayerToTree.z * vecPlayerToTarget.x;
                const distanceToLine = Math.abs(crossProduct) / Math.sqrt(lenSqPlayerToTarget);

                if (distanceToLine < corridorWidth / 2) {
                    return true; // Point is in the corridor
                }
            }
        }
        return false; // Position is valid
    },

    generateForest: function(scene, processedTemplates, targets) {
        const numberOfTrees = 200;
        const areaSize = 300;

        // --- Exclusion Zone Parameters ---
        const playerPos = { x: 0, z: 0 };
        const playerExclusionRadius = 15;
        const targetExclusionRadius = 15;
        const corridorWidth = 10;
        // ---------------------------------

        for (let i = 0; i < numberOfTrees; i++) {
            const { template, verticalOffset } = processedTemplates[Math.floor(Math.random() * processedTemplates.length)];
            const tree = template.clone(true);

            // Set random position, respecting exclusion zones
            let x, z;
            do {
                x = (Math.random() - 0.5) * areaSize;
                z = (Math.random() - 0.5) * areaSize;
            } while (this.isPositionInExclusionZone(x, z, targets, playerPos, playerExclusionRadius, targetExclusionRadius, corridorWidth));

            const baseScale = 4.0 + Math.random() * 3.0;
            const heightVariation = 0.8 + Math.random() * 0.4;
            const widthVariation = 0.9 + Math.random() * 0.2;
            const scaleX = baseScale * widthVariation;
            const scaleY = baseScale * heightVariation;
            const scaleZ = baseScale * widthVariation;
            tree.scale.set(scaleX, scaleY, scaleZ);

            const finalY = verticalOffset * scaleY;
            tree.position.set(x, finalY, z);
            tree.rotation.y = Math.random() * Math.PI * 2;

            tree.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(tree);
        }
        console.log(`[populate_forest.js] Generated a forest with ${numberOfTrees} trees, respecting exclusion zones.`);
    }
};

export { _populateForest };