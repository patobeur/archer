import * as THREE from "three";
export let _soleil = {
	sun: null,
	groupe: null,
	_scene: null,
	config: {
        grp_name: 'grp_sun',
        name: 'soleil',
        color: 0xffffff,
        power: 1,
        radius: 70,
        rotationSpeed: 0.1,
        position: new THREE.Vector3(230, 185, 120),
        size: { x: 2, y: 2, z: 2 },
        mat: {
            color: 0xFFFFFF00,
            emissive: 0xFF00FF,
            emissiveIntensity: 2,
        }
	},
	init: function (_scene) {
		this._scene= _scene
		// this.config.position.y = this.config.radius
		// this.floorSize = _dataz.floorsByName.main.floorSizes
		this.add();
	},
	add: function () {
		// this.config.position = new THREE.Vector3(
		// 	this.floorSize.x / 2,
		// 	this.floorSize.y / 2,
		// 	this.floorSize.x / 2
		// )
		this.groupe = new THREE.Group()
		this.groupe.name = this.config.grp_name
		this.groupe.position.set(this.config.position.x,this.config.position.y,this.config.position.z);

		// -------------------------------------------------
		// une sphere là ou est le soleil
		const sphereGeometry = new THREE.SphereGeometry(this.config.size.x, 32, 32);
		const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, transparent: true, opacity: .5 });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.castShadow = false;
		sphere.receiveShadow = false;
		this.groupe.add(sphere);

		// une autre sphere pour le soleil
		const soleilGeometry = new THREE.SphereGeometry(this.config.size.x * .6, 16, 16);
		const soleilMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xffff00 });
		const soleilAvatar = new THREE.Mesh(soleilGeometry, soleilMaterial);
		soleilAvatar.castShadow = false;
		soleilAvatar.receiveShadow = false;
		this.groupe.add(soleilAvatar);

		// -------------------------------------------------
		// le vrai soleil
		this.sun = new THREE.DirectionalLight('#FFF6D6', 2);
		this.sun.name = 'sun'

		this.sun.receiveShadow = false;
		this.sun.shadow.mapSize.width = 2048
		this.sun.shadow.mapSize.height = 2048
		this.sun.shadow.bias = -0.0027
		this.sun.shadow.camera.near = 0.5
		this.sun.shadow.camera.far = 1000
		this.sun.shadow.camera.top = 1000
		this.sun.shadow.camera.bottom = -1000
		this.sun.shadow.camera.left = -1000
		this.sun.shadow.camera.right = 1000
		this.sun.shadow.radius = 1
		this.sun.shadow.blurSamples = 10
		// this.sun.direction = { x: 0, y: 0, z: 0 }
		// this.sun.target.position.set(0,50,0)
		this.sun.castShadow = true
		this.sun.receiveShadow = false;
		this.groupe.add(this.sun);


		// Add helper for the shadow camera
		// const helper = new THREE.CameraHelper(this.sun.shadow.camera);
		// this.groupe.add(helper);

		this._scene.scene.add(this.groupe);

	},
	animate: function (delta) {
		// Faire tourner la sphère autour du centre (0,0,0) 
		this.rotationB((0, 0, 0),delta);
		// this.rotateAroundPoint(this.groupe,new THREE.Vector3(0, 0, 0),delta,this.config);
	},
	// -----------------------------
	rotateAroundPoint: (obj, center, delta, config) => {
        // console.log('obj', obj)
        // console.log('center', center)
        // console.log('delta', delta)
        console.log('config', config)
		// Augmenter l'angle pour la rotation
		obj.userData.angle = (obj.userData.angle || 0) + (config.rotationSpeed * delta);

		// Calculer les nouvelles coordonnées de l'objet
		const x = center.x + config.radius * Math.cos(obj.userData.angle);
		const y = center.y + config.radius * Math.sin(obj.userData.angle);
		const z = center.z + config.radius * Math.cos(obj.userData.angle)//obj.position.z; // Garder la même hauteur

		// // Appliquer les nouvelles coordonnées
		obj.position.set(x, y, z);
        // // console.log(obj.position.x, obj.position.y, obj.position.z)
	},
	rotation(centerV3 = [0, 0, 0],delta) {
        console.log('this.groupe.position (avant rotation):', this.groupe.position);
    
        var rotationSpeed = 0.01; // Un angle visible
    
        // Créer un vecteur représentant le centre de rotation
        var center = new THREE.Vector3(centerV3[0], centerV3[1], centerV3[2]);
    
        // Calcul du vecteur relatif
        var relative = new THREE.Vector3().subVectors(this.groupe.position, center);
    
        // Vérification si l’objet est sur l'axe Y (évite la rotation inutile)
        if (relative.x === 0 && relative.z === 0) {
            console.warn("L'objet est aligné sur l'axe Y, rotation autour de Y inefficace.");
            return;
        }
    
        // Calcul de la rotation autour de l'axe Y
        var newX = relative.x * Math.cos(rotationSpeed) - relative.z * Math.sin(rotationSpeed);
        var newZ = relative.x * Math.sin(rotationSpeed) + relative.z * Math.cos(rotationSpeed);
        var newY = relative.y; // Pas de rotation sur Y
    
        // Appliquer la nouvelle position
        this.groupe.position.set(newX + center.x, newY + center.y, newZ + center.z);
    
        console.log('this.groupe.position (après rotation):', this.groupe.position);
    },
	rotationB(centerV3 = [0, 0, 0],delta) {    
        var rotationSpeed = this.rotationSpeed; // Un angle visible
        var speed = delta * rotationSpeed * 3

        // Créer un vecteur représentant le centre de rotation
        var center = new THREE.Vector3(centerV3[0], centerV3[1], centerV3[2]);
    
        // Calcul du vecteur relatif
        var relative = new THREE.Vector3().subVectors(this.groupe.position, center);
    
        // Vérification si l’objet est sur l'axe Y (évite la rotation inutile)
        if (relative.x === 0 && relative.z === 0) {
            console.warn("L'objet est aligné sur l'axe Y, rotation autour de Y inefficace.");
            return;
        }
    
        // Calcul de la rotation autour de l'axe Y
        var newX = relative.x * Math.cos(speed) - relative.z * Math.sin(speed);
        var newZ = relative.x * Math.sin(speed) + relative.z * Math.cos(speed);
        var newY = relative.y;
    
        // Appliquer la nouvelle position
        this.groupe.position.set(newX + center.x, newY + center.y, newZ + center.z);
		console.log('x',newX,center.x)
		console.log('y',newY,center.y)
		console.log('z',newZ,center.z)
	}
};

