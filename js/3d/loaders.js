"use strict";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let _GLTFLoader = {
	// ------------------------
	// GLTFLoader for GLTF MESH
	// ------------------------
	root: undefined,
	demoActive: false,
	_consoleOn: false,
	callback: () => { if (this._consoleOn) console.log('no call back function for _GLTFLoader') },
	gltfLoader: undefined,
	models: {},
	loadCounter: 0,
	init: function (root = '', callbackFunction = this.callback) {
		this.root = root
		if (typeof callbackFunction != 'function') callbackFunction = this.callback;

		this.gltfLoader = new GLTFLoader();

		let model3dList = [..._tank.tank]

		let gap = 5
		let x = 0, cx = 0, cy = -40
		model3dList.forEach(element => {
			if (element.set != 'tank') {
				element.file = this.root + element.file
				element.position.x = cx
				element.position.z = cy
				if (cx < 100) { cx = cx + gap }
				if (cx >= 100) {
					cx = x;
					cy += gap;
				}
			}

			this.gltfLoader.load(
				element.file,
				(gltf) => {
					this.loadCounter++;
					const model = gltf.scene;
					model.position.x = element.position.x;
					model.position.z = element.position.z;
					model.position.y = element.position.y;
					model.castShadow = true
					model.receiveShadow = true
					model.traverse((node) => {
						if (node.isMesh) {
							node.receiveShadow = true
							node.castShadow = true;
						}
					});
					this.models[element.name] = model
					model.userData.set = element.set ?? false;
					model.userData.name = element.name ?? false;
					// if (this._consoleOn) console.log('Model ' + element.name + ' loaded', model);
					// if (model.name === 'Scene') {
					// 	if (model.children[0]) {
					// 		console.log('>>>', model.children[0])
					// 		if (model.children[0].animations) {
					// 			console.log('>>>', model.children[0].animations)
					// 		}
					// 	}
					// }
					if (this.loadCounter === model3dList.length) {
						// _GLTFLoader.testAnimation(callbackFunction);
						callbackFunction('_GLTFLoader ok. '+ model3dList.length + ' gltf'+(this.filesCounter>1?'s':'')+' loaded...');
					}
				}, undefined, (error) => {
					console.error('_GLTFLoader', error);
				}
			);
		});
	},
	// addModelsToScene: function (scene) {
	// 	for (const key in this.models) {
	// 		scene.add(this.models[key]);
	// 	}
}
let _TextureLoader = {
	root: undefined,
	_consoleOn:true,
	callback: () => { 
		if (_TextureLoader._consoleOn) {
			console.log('no call back function for _TextureLoader')
		}
	},
	textures: {},
	counter: 0,
	filesCounter: 0,
	textureLoader: new THREE.TextureLoader(),
	init: function (_textures, root = '', callbackFunction = this.callback) {
		this.root = root
		this.callbackFunction = callbackFunction
		this.counter = 0
		// Chargement des textures pour chaque objet
		_textures.forEach(element => {
			console.log('element',element.set,element.name)
			this.addToStack(element)
			this.filesCounter++

		});
	},
	checkEnd: function () {
		if (this.counter == this.filesCounter) {
			this.callbackFunction(this.textures,'_TextureLoader ok. '+ this.filesCounter + ' file'+(this.filesCounter>1?'s':'')+' loaded...')
		}
	},
	addToStack: function (file) {
		this.loadTexture(file, (map) => {
			this.counter++;
			map.name = file.name
			this.textures[file.name] = { map: map, name: file.name, sizes: file.sizes }
			console.log(file,map)
			// if (this._consoleOn) console.log('texture loaded', file.file, this.counter + '/' + this.files.length)

			this.checkEnd()
		});
	},
	loadTexture: function (file, callback) {
		// Chargement de la texture
		let fileurl = this.root + file.file
		this.textureLoader.load(
			fileurl,
			(texture) => {
				// La texture a été chargée avec succès !!!
				callback(texture);
			},
			(xhr) => {
				// Progression du chargement de la texture (optionnel)
				const percentLoaded = (xhr.loaded / xhr.total) * 100;
				// this.texturesDivByName[file.name].style.width = (100 - percentLoaded) + '%'
				if (this._consoleOn) console.log('Texture chargée :' + `${percentLoaded}% ${file.fileName} `);
			},
			(error) => {
				console.error('Erreur de chargement de la texture :', error);
			}
		);
	},
};
export { _GLTFLoader, _TextureLoader}
