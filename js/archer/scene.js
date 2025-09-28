import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { _soleil } from '../3d/lib/soleil.js';
const _scene  = {
	scene:undefined,
	camera:undefined,
	miniCamera:undefined,
	renderer:undefined,
	controls:undefined,
	gravity: new THREE.Vector3(0, -0.02, 0),
	init:function(container){
		// Setup scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x11438f);
		// this.scene.background = new THREE.Color(0x103355);
		// this.scene.fog = new THREE.Fog(0x87CEEB, 10, 120);
		this.scene.fog = new THREE.Fog(0x000010, 10, 250);
		// this.scene.background = new THREE.Color( 0x000020  );

		// Setup camera
		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 1.8, 40);
		this.camera.name = 'one'

		this.miniCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
		this.miniCamera.position.set(0, 2, 20);
		this.camera.name = 'two'

		// Setup renderer

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});



		// Configuration du rendu
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		this.renderer.autoClear = true
		// this.renderer.toneMapping = THREE.ACESFilmicToneMapping
		// this.renderer.toneMappingExposure = 1
		// this.renderer.setClearColor(0x000010, 1.0);
		this.renderer.shadowMap.enabled = true

		container.appendChild(this.renderer.domElement);

		// Controls
		const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (!isTouchDevice) {
			this.controls = new PointerLockControls(this.camera, container);
			container.addEventListener('click', () => this.controls.lock());
			this.scene.add(this.controls.getObject());
		}

		// Lights
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 10, 10).normalize();
		light.shadow.mapSize.width = 2048; // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.1; // default
		light.shadow.camera.far = 100; // default
		light.shadow.camera.left = -100;
		light.shadow.camera.right = 100;
		light.shadow.camera.top = 100;
		light.shadow.camera.bottom = -100;
		light.castShadow = true
		light.receiveShadow = false;
		this.scene.add(light);

		var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		this.scene.add(ambientLight);

		// Ground
		const groundGeometry = new THREE.PlaneGeometry(500, 500);
		const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xEAFFEA });
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.rotation.x = -Math.PI / 2;
		ground.position.x = 0;
		ground.castShadow = true
		ground.receiveShadow = true;
		this.scene.add(ground);

		this.soleil = _soleil;

		this.soleil.init(_scene)




		// Resize handler
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}
}
export { _scene }