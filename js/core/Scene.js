import * as THREE from 'three';
import { _soleil } from '../world/Sun.js';
const _scene  = {
	scene:undefined,
	camera:undefined,
	miniCamera:undefined,
	renderer:undefined,
	controls:undefined,
    playerAllowedZone: {
        radius: 10,
        position: new THREE.Vector3(0, 0, 40)
    },
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
		this.camera.position.set(this.playerAllowedZone.position.x, 1.8, this.playerAllowedZone.position.z);
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

        const circleGeometry = new THREE.CircleGeometry(this.playerAllowedZone.radius, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.rotation.x = -Math.PI / 2;
        circle.position.y = 0.01; // Slightly above the ground to avoid z-fighting
        circle.position.x = this.playerAllowedZone.position.x;
        circle.position.z = this.playerAllowedZone.position.z;
        this.scene.add(circle);

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