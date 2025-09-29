import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const _populateForest = {
	init: function (scene) {
		console.log(
			"[populate_forest.js] Initializing forest in a ring layout..."
		);

		const loader = new GLTFLoader();
		const modelUrl = "./assets/3dObjects/Forest.glb";

		loader.load(
			modelUrl,
			(gltf) => {
				const treeTemplates = gltf.scene.children.filter(
					(child) => child.isMesh || child.isGroup
				);

				if (treeTemplates.length > 0) {
					console.log(
						`[populate_forest.js] Found ${treeTemplates.length} tree templates.`
					);

					const processedTemplates = treeTemplates.map((template) => {
						const box = new THREE.Box3().setFromObject(template);
						const verticalOffset = -box.min.y;
						return { template, verticalOffset };
					});

					while (gltf.scene.children.length > 0) {
						gltf.scene.remove(gltf.scene.children[0]);
					}

					this.generateForest(scene, processedTemplates);
				} else {
					console.error(
						"[populate_forest.js] No suitable tree templates found in the GLB file."
					);
				}
			},
			undefined,
			(error) => {
				console.error(
					"[populate_forest.js] Error loading GLB model:",
					error
				);
			}
		);
	},

	generateForest: function (scene, processedTemplates) {
		const numberOfTrees = 35; // Increased density for the ring
		const outerRadius = 80;
		const innerRadius = 70; // Large clear area in the center

		for (let i = 0; i < numberOfTrees; i++) {
			const { template, verticalOffset } =
				processedTemplates[
					Math.floor(Math.random() * processedTemplates.length)
				];
			const tree = template.clone(true);

			// Generate a position within the ring
			let x, z, distance;
			do {
				// Generate a point in the square bounding the outer circle
				x = (Math.random() - 0.5) * outerRadius * 2;
				z = (Math.random() - 0.5) * outerRadius * 2;
				distance = Math.sqrt(x * x + z * z);
			} while (distance > outerRadius || distance < innerRadius); // Keep generating until it's in the ring

			const baseScale = 14.0 + Math.random() * 3.0;
			const heightVariation = 0.8 + Math.random() * 0.4;
			const widthVariation = 0.9 + Math.random() * 0.1;
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

		console.log(
			`[populate_forest.js] Generated a forest with ${numberOfTrees} trees in a ring layout.`
		);
	},
};

export { _populateForest };
