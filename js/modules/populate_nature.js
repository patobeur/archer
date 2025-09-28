import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const _populateNature = {
    init: async function(scene) {
        console.log('[populate_nature.js] Initializing nature population...');

        try {
            const response = await fetch('./js/data/nature_positions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const natureObjects = await response.json();

            console.log(`[populate_nature.js] Found ${natureObjects.length} objects to populate.`);

            const mtlLoader = new MTLLoader();
            const objLoader = new OBJLoader();

            for (const objData of natureObjects) {
                const materialUrl = `./assets/3dObjects/natures/${objData.name}.mtl`;
                const objectUrl = `./assets/3dObjects/natures/${objData.name}.obj`;

                mtlLoader.load(materialUrl, (materials) => {
                    materials.preload();
                    objLoader.setMaterials(materials);
                    objLoader.load(objectUrl, (object) => {
                        // Position
                        if (objData.position) {
                            object.position.set(objData.position.x, objData.position.y, objData.position.z);
                        }

                        // Rotation
                        if (objData.rotation) {
                            object.rotation.set(objData.rotation.x, objData.rotation.y, objData.rotation.z);
                        }

                        // Scale
                        if (objData.scale) {
                            object.scale.set(objData.scale.x, objData.scale.y, objData.scale.z);
                        }

                        // Enable shadows for the object and its children
                        object.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });

                        scene.add(object);
                        console.log(`[populate_nature.js] Added ${objData.name} to the scene.`);
                    }, undefined, (error) => {
                        console.error(`[populate_nature.js] Error loading OBJ for ${objData.name}:`, error);
                    });
                }, undefined, (error) => {
                    console.error(`[populate_nature.js] Error loading MTL for ${objData.name}:`, error);
                });
            }
        } catch (error) {
            console.error('[populate_nature.js] Failed to load or parse nature positions data:', error);
        }
    }
};

export { _populateNature };