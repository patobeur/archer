import * as THREE from "three";
import { _GLTFLoader, _TextureLoader } from './loaders.js';

const DEFAULT_GROUP = 1 << 0; // 1
const DEFAULT_MASK = 0xFFFF;  // Collide with everything
const PLAYER_GROUP = 1 << 1; // 2
const PLAYER_MASK = DEFAULT_GROUP | (1 << 2); // Collision avec DEFAULT_GROUP et un autre groupe spécifique

let _modelsPhysicsAuto = {
	'plot1': {
		name: "plot1",
		shapeType: 'btBoxShape',
		btBoxShape: { x: 1, y: 2, z: 1 },
		pos: { x: -5, y: 1, z: -5 },
		inertia: { x: 0, y: 0, z: 0 },
		quat: { x: 0, y: 0, z: 0, w: 1 },
		mass: 0,
		mesh: undefined,
		shape: undefined,
		color: 0xff0000,
		shininess: 100,
		castShadow: true,
		receiveShadow: true,
		physics: {
			friction: 1,
			restitution: 0
		}
	},
	'plot2': {
		name: "plot2",
		shapeType: 'btBoxShape',
		btBoxShape: { x: 1, y: 2, z: 1 },
		pos: { x: -5, y: 1, z: 5 },
		inertia: { x: 0, y: 0, z: 0 },
		quat: { x: 0, y: 0, z: 0, w: 1 },
		mass: 0,
		mesh: undefined,
		shape: undefined,
		color: 0xff0000,
		// transparent: true,
		// opacity: 0.8,
		shininess: 100,
		castShadow: true,
		receiveShadow: true,
		physics: {
			friction: 1,
			restitution: 0
		}
	},
	'plot3': {
		name: "plot3",
		shapeType: 'btBoxShape',
		btBoxShape: { x: 1, y: 2, z: 1 },
		pos: { x: 5, y: 1, z: -5 },
		inertia: { x: 0, y: 0, z: 0 },
		quat: { x: 0, y: 0, z: 0, w: 1 },
		mass: 0,
		mesh: undefined,
		shape: undefined,
		color: 0xff0000,
		// transparent: true,
		// opacity: 0.8,
		shininess: 100,
		castShadow: true,
		receiveShadow: true,
		physics: {
			friction: 1,
			restitution: 0
		}
	},
	'plot4': {
		name: "plot4",
		shapeType: 'btBoxShape',
		btBoxShape: { x: 1, y: 2, z: 1 },
		pos: { x: 5, y: 1, z: 5 },
		inertia: { x: 0, y: 0, z: 0 },
		quat: { x: 0, y: 0, z: 0, w: 1 },
		mass: 0,
		mesh: undefined,
		shape: undefined,
		color: 0xff0000,
		// transparent: true,
		// opacity: 0.8,
		shininess: 100,
		castShadow: true,
		receiveShadow: true,
		physics: {
			friction: 1,
			restitution: 0
		}

	},
	// 'wall1': {
	// 	name: "wall1",
	// 	shapeType: 'btBoxShape',
	// 	btBoxShape: { x: 20, y: 2, z: .5 },
	// 	pos: { x: 0, y: 1, z: 9.75 },
	// 	inertia: { x: 0, y: 0, z: 0 },
	// 	quat: { x: 0, y: 0, z: 0, w: 1 },
	// 	mass: 0,
	// 	mesh: undefined,
	// 	shape: undefined,
	// 	color: 0xffff00,
	// 	// transparent: true,
	// 	// opacity: 0.8,
	// 	shininess: 100,
	// 	castShadow: true,
	// 	receiveShadow: true,
	// 	physics: {
	// 		friction: 1,
	// 		restitution: 0
	// 	}
	// },
	// 'wall2': {
	// 	name: "wall2",
	// 	shapeType: 'btBoxShape',
	// 	btBoxShape: { x: .5, y: 2, z: 19.50 },
	// 	pos: { x: 9.75, y: 1, z: 0 },
	// 	inertia: { x: 0, y: 0, z: 0 },
	// 	quat: { x: 0, y: 0, z: 0, w: 1 },
	// 	mass: 0,
	// 	mesh: undefined,
	// 	shape: undefined,
	// 	color: 0x662626,
	// 	// transparent: true,
	// 	// opacity: 0.8,
	// 	shininess: 100,
	// 	castShadow: true,
	// 	receiveShadow: true,
	// 	physics: {
	// 		friction: 1,
	// 		restitution: 0
	// 	}
	// },
	// 'wall3': {
	// 	name: "wall3",
	// 	shapeType: 'btBoxShape',
	// 	btBoxShape: { x: .5, y: 2, z: 19.50 },
	// 	pos: { x: -9.75, y: 1, z: 0 },
	// 	inertia: { x: 0, y: 0, z: 0 },
	// 	quat: { x: 0, y: 0, z: 0, w: 1 },
	// 	mass: 0,
	// 	mesh: undefined,
	// 	shape: undefined,
	// 	color: 0x252566,
	// 	// transparent: true,
	// 	// opacity: 0.8,
	// 	shininess: 100,
	// 	castShadow: true,
	// 	receiveShadow: true,
	// 	physics: {
	// 		friction: 1,
	// 		restitution: 0
	// 	}
	// },
	// 'wall4': {
	// 	name: "wall4",
	// 	shapeType: 'btBoxShape',
	// 	btBoxShape: { x: 20, y: 2, z: .5 },
	// 	pos: { x: 0, y: 1, z: -9.75 },
	// 	inertia: { x: 0, y: 0, z: 0 },
	// 	quat: { x: 0, y: 0, z: 0, w: 1 },
	// 	mass: 0,
	// 	mesh: undefined,
	// 	shape: undefined,
	// 	color: 0xffff00,
	// 	// transparent: true,
	// 	// opacity: 0.8,
	// 	shininess: 100,
	// 	castShadow: true,
	// 	receiveShadow: true,
	// 	physics: {
	// 		friction: 1,
	// 		restitution: 0
	// 	}
	// },
}
let mapRatio = 0.025;
let _modelsPhysics = {
	'groundZero': {
		name: "groundZero",
		shapeType: 'btBoxShape',
		mapFile: 'foot',
		btBoxShape: { x: 200, y: .25, z: 200 },
		pos: { x: 0, y: -.125, z: 0 },
		inertia: { x: 0, y: 0, z: 0 },
		quat: { x: 0, y: 0, z: 0, w: 1 },
		mass: 0,
		mesh: undefined,
		shape: undefined,
		color: 0xEAEAEA,
		// transparent: true,
		opacity: 0.8,
		shininess: 100,
		castShadow: true,
		receiveShadow: true,
		physics: {
			friction: 1,
			restitution: 0.1
		},
		group: PLAYER_GROUP,
		mask: PLAYER_MASK

		
	},
}
let _physics = {
	// Ammo.js
	gravity: new THREE.Vector3(0, -9.810, 0),
	inertia: new THREE.Vector3(1, 1, 1),
	// ---------------------------------
	tmpTransformation: undefined,
	physicsWorld: undefined,
	rigidBody_List: new Array(),
	friction: 0.5, // Friction ajoutée
	restitution: 0.5,  // Restitution ajoutée
	modelsPhysics: _modelsPhysics,
	modelsPhysicsAuto: _modelsPhysicsAuto,
	// ------ Physics World setup ------
	_setupPhysicsWorld: function () {
		// this.tmpTransformation = new Ammo.btTransform();

		var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		var overlappingPairCache = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();

		this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
	},
	// ------ Physics World setup ------
	_initPhysicsWorld: function () {
		var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		var overlappingPairCache = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();

		this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.physicsWorld.setGravity(new Ammo.btVector3(this.gravity.x, this.gravity.y, this.gravity.z));
	},
	updateWorldPhysics: function (deltaTime, time) {
		let tmpTransformation = new Ammo.btTransform();
		this.physicsWorld.stepSimulation(deltaTime, 10);

		for (let i = 0; i < this.rigidBody_List.length; i++) {
			let Graphics_Obj = this.rigidBody_List[i];
			let Physics_Obj = Graphics_Obj.userData.physicsBody;
			let motionState = Physics_Obj.getMotionState();

			// faire bouger les markers
			if (Graphics_Obj.userData.updateMe) Graphics_Obj.userData.updateMe(Graphics_Obj, time)

			// Activer les objets physiques pour qu'ils réagissent correctement
			Physics_Obj.activate();

			if (motionState) {
				motionState.getWorldTransform(tmpTransformation);
				let new_pos = tmpTransformation.getOrigin();
				let new_qua = tmpTransformation.getRotation();
				Graphics_Obj.position.set(new_pos.x(), new_pos.y(), new_pos.z());
				Graphics_Obj.quaternion.set(new_qua.x(), new_qua.y(), new_qua.z(), new_qua.w());
			}
		}
		// Appeler la détection des collisions
		// this.detectCollisions();
	},
	// ---------------------------------------------------
	// MESHS CREATION
	// ---------------------------------------------------
	// add_MarkerTo: (mesh, scale, name = 'vide') => {
	// 	const markerGeometry = new THREE.BoxGeometry(.2, .2, .2)
	// 	const markerMaterial = new THREE.MeshPhongMaterial({ color: ((name === 'vide') ? 0x000000 : 0x00ff00) })
	// 	let markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
	// 	markerMesh.name = 'marker'
	// 	markerMesh.rotation.y = Math.PI / 4
	// 	markerMesh.castShadow = true;
	// 	markerMesh.receiveShadow = true;
	// 	mesh.add(markerMesh)
	// 	markerMesh.position.y = (scale.y / 2) + (.15);
	// },
	_transform: function (position, quaternion) {
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
		return transform
	},
	_quaternion: function (rotation_q) {
		let quaternion = undefined;
		if (rotation_q == null) {
			quaternion = { x: 0, y: 0, z: 0, w: 1 };
		}
		else {
			quaternion = rotation_q;
		}
		return quaternion
	},
	// ---------------------------------------------------
	// MESHS CREATION
	// ---------------------------------------------------
	set_MeshAndPhysics: function (config, _scene) {
		// console.log('-----------')
		// console.log('config',config)

		// Log for debugging
		// console.log('--------------------------------');
		// console.log('Setting mesh and physics for:', config.name);
		let group = config.group ?? DEFAULT_GROUP
		let mask = config.mask ?? DEFAULT_MASK

		this.set_Mesh(config)
		this.set_Shape(config)
		this.makeItPhysic(config, group, mask)
		this[config.name] = config
		// _scene.scene.add(config.mesh)
		// Log for debugging
		// console.log('Mesh and physics set for:', config.name);
	},
	set_Mesh: function (config) {
		let scale = config[config.shapeType]
		let geometry = undefined
		let material = undefined

		switch (config.shapeType) {
			case 'btBoxShape':
				geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z)
				// material = new THREE.MeshPhongMaterial({
				// 	color: config.color ?? 0xffffff,
				// 	transparent: config.transparent ?? false,
				// 	opacity: config.opacity ?? 1,
				// 	shininess: config.shininess ?? 0,
				// })
				break;
			case 'btSphereShape':
				geometry = new THREE.SphereGeometry(scale.x, scale.y, scale.z)
				// material = new THREE.MeshPhongMaterial({
				// 	color: config.color ?? 0xffffff,
				// 	transparent: config.transparent ?? false,
				// 	opacity: config.opacity ?? 1,
				// 	shininess: config.shininess ?? 0,
				// })
				break;
			default:
				geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z)
				// material = new THREE.MeshPhongMaterial({
				// 	color: config.color ?? 0xffffff,
				// 	transparent: config.transparent ?? false,
				// 	opacity: config.opacity ?? 1,
				// 	shininess: config.shininess ?? 0,
				// })
				break;
		}
		if (config.mapFile && config.shapeType=="btBoxShape" && config.btBoxShape) {
			console.log('-------------------')
			console.log('_TextureLoader.textures[floor]')
			console.log(_TextureLoader.textures[config.mapFile].sizes)
			let w = Math.floor(_TextureLoader.textures[config.mapFile].sizes.width * mapRatio)
			let h = Math.floor(_TextureLoader.textures[config.mapFile].sizes.height * mapRatio)
			console.log(w,h)
			geometry = new THREE.BoxGeometry(w , scale.y, h)
			material = new THREE.MeshPhongMaterial({
				map: _TextureLoader.textures[config.mapFile].map,
				color: config.color ?? 0xffffff,
				transparent: config.transparent ?? false,
				opacity: config.opacity ?? 1,
				shininess: config.shininess ?? 0,
			})
		}
		else {
			material = new THREE.MeshPhongMaterial({
				color: config.color ?? 0xffffff,
				transparent: config.transparent ?? false,
				opacity: config.opacity ?? 1,
				shininess: config.shininess ?? 0,
			})
		}

		config.mesh = new THREE.Mesh(geometry, material);
		// this.add_MarkerTo(config.mesh, scale, 'vide');
	},
	set_Shape: function (config) {
		config.mesh.name = config.name
		let scale = config[config.shapeType]

		config.mesh.position.set(config.pos.x, config.pos.y, config.pos.z)
		config.mesh.castShadow = config.castShadow ?? false
		config.mesh.receiveShadow = config.receiveShadow ?? false

		switch (config.shapeType) {
			case 'btBoxShape':
				config.shape = new Ammo.btBoxShape(
					new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
				);
				break;
			case 'btSphereShape':
				config.shape = new Ammo.btSphereShape(scale.x);
				break;
			default:
				console.log('DEFAULT ????', scale)
				config.shape = new Ammo.btBoxShape(
					new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
				);
				break;
		}
	},
	makeItPhysic: function (config, group = DEFAULT_GROUP, mask = DEFAULT_MASK) {
		let pos = config.pos
		let inertia = config.inertia ?? { x: 0, y: 0, z: 0 }
		let quat = this._quaternion(config.quat);

		let mass = config.mass
		let shape = config.shape
		shape.setMargin(0.05)
		shape.calculateLocalInertia(mass, inertia)
		// ----
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
		transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
		let motionState = new Ammo.btDefaultMotionState(transform);
		// ----
		let localInertia = new Ammo.btVector3(inertia.x, inertia.y, inertia.z);
		shape.calculateLocalInertia(mass, localInertia);
		// ----
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(
			mass, motionState, shape, localInertia
		);
		let body = new Ammo.btRigidBody(rbInfo);
		_physics.physicsWorld.addRigidBody(body, group, mask);
		config.mesh.userData.physicsBody = body

		if (config.physics) {
			body.setFriction(config.physics.friction ?? 1);
			body.setRestitution(config.physics.restitution ?? 0);
		}
		this.rigidBody_List.push(config.mesh)
	},
	// ---------------------------------------------------
	// RANDOM CREATION
	// ---------------------------------------------------
	addRandomSphere: function (_scene, max = 10) {
		console.log('addRandomSphere')
		let hauteurDeDepart = 3;
		for (let index = 0; index < max; index++) {
			let config = {
				name: "rndSphere",
				shapeType: 'btSphereShape',
				btSphereShape: new THREE.Vector3(0.5, 32, 32),
				pos: new THREE.Vector3(
					(Math.random() * 40) - 20,
					hauteurDeDepart + Math.random() * 10,
					(Math.random() * 40) - 20
				),
				inertia: { x: 0, y: 0, z: 0 },
				quat: new THREE.Quaternion(0, 0, 0, 1).normalize(),
				mass: 0.5,
				mesh: undefined,
				shape: undefined,
				color: Math.random() * 0xffffff,
				transparent: false,
				opacity: 1,//Math.random() * 1,
				shininess: 100,
				castShadow: true,
				receiveShadow: true,
				physics: {
					friction: 0,
					restitution: 0.5,
				}
			}
			_physics.set_MeshAndPhysics(config, _scene, false)
			_scene.scene.add(config.mesh);
		}
	},
	addRandomBox: function (_scene, max = 10) {
		console.log('addRandomBox')
		let hauteurDeDepart = 10;
		for (let index = 0; index < max; index++) {
			let config = {
				name: "rndBox",
				shapeType: 'btBoxShape',
				btBoxShape: { x: 1, y: 1, z: 1 },
				pos: new THREE.Vector3(
					(Math.random() * 40) - 20,
					hauteurDeDepart + Math.random() * 10,
					(Math.random() * 40) - 20
				),
				inertia: { x: 0, y: 0, z: 0 },
				quat: new THREE.Quaternion(Math.random(), Math.random(), Math.random(), Math.random()).normalize(),
				mass: 1,
				mesh: undefined,
				shape: undefined,
				color: Math.random() * 0xffffff,
				transparent: false,
				opacity: 1,//Math.random() * 1,
				shininess: 100,
				castShadow: true,
				receiveShadow: true,
				physics: {
					friction: 0.5,
					restitution: 0.1,
				}
			}
			this.set_MeshAndPhysics(config, _scene, false)
			_scene.scene.add(config.mesh);
		}
	},
	addRandomPlat: function (_scene, max = 10) {
		console.log('addRandomPlat')
		let hauteurDeDepart = 5;
		for (let index = 0; index < max; index++) {
			let config = {
				name: "plat1",
				shapeType: 'btBoxShape',
				btBoxShape: { x: 1, y: .25, z: 1 },
				pos: new THREE.Vector3(
					(Math.random() * 40) - 20,
					hauteurDeDepart + Math.random() * 10,
					(Math.random() * 40) - 20
				),
				inertia: { x: 0, y: 0, z: 0 },
				quat: new THREE.Quaternion(Math.random(), Math.random(), Math.random(), Math.random()).normalize(),
				mass: 0.8,
				mesh: undefined,
				shape: undefined,
				color: Math.random() * 0xffffff,
				transparent: false,
				opacity: 1,//Math.random() * 1,
				shininess: Math.random() * 100,
				castShadow: true,
				receiveShadow: true,
				physics: {
					friction: 1,
					restitution: .2,
					rotation_q: new THREE.Quaternion(Math.random(), Math.random(), Math.random(), Math.random()).normalize(),
				}
			}
			this.set_MeshAndPhysics(config, _scene, false)
			_scene.scene.add(config.mesh);
		}
	},
	// ---------------------------------------------------
	// BASICS CREATION
	// ---------------------------------------------------
}
export { _physics }
