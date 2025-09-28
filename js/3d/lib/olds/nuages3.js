import * as THREE from 'three';
import { _front } from '../../../front.js';



const _createClouds = {
    scene: null,
    target: null,
    maxClouds: 50,
    spawnRate: 2000,
    numSpheresPerGroup: 6,
    spawnDistance: 150,
    speed: 0.1,
    direction: new THREE.Vector3(),
    clouds: [],
    windArrow: null,

    /** Initialise le gestionnaire de nuages */
    init(scene, target, maxClouds = 50, spawnRate = 2000, numSpheresPerGroup = 6, spawnDistance = 150, speed = 0.1, directionChangeRate = 15000) {
        this.scene = scene;
        this.target = target;
        this.maxClouds = maxClouds;
        this.spawnRate = spawnRate;
        this.numSpheresPerGroup = numSpheresPerGroup;
        this.spawnDistance = spawnDistance;
        this.speed = speed;
        this.clouds = [];
        this.direction = this.generateRandomDirection();

        this.windArrow = WindArrow; // Utiliser directement l'objet WindArrow
        this.windArrow.init(target);
        this.windArrow.updateWindDirection(this.direction);

        this.startSpawning();
        this.changeDirectionPeriodically(directionChangeRate);
    },

    /** Génère une direction aléatoire pour le vent */
    generateRandomDirection(previousDirection = null) {
        let angleChange = (Math.random() * 40 - 20) * (Math.PI / 180); // ±20° de variation
        if (previousDirection) {
            let currentAngle = Math.atan2(previousDirection.z, previousDirection.x);
            let newAngle = currentAngle + angleChange;
            return new THREE.Vector3(Math.cos(newAngle), 0, Math.sin(newAngle)).normalize();
        } else {
            return new THREE.Vector3(
                Math.random() * 2 - 1, 0, Math.random() * 2 - 1
            ).normalize();
        }
    },

    /** Change la direction du vent périodiquement */
    changeDirectionPeriodically(interval) {
        setInterval(() => {
            this.setWindDirection(this.generateRandomDirection(this.direction));
        }, interval);
    },

    /** Définit la nouvelle direction du vent */
    setWindDirection(newDirection) {
        this.direction.copy(newDirection);
        this.windArrow.updateWindDirection(this.direction);
        this.clouds.forEach(cloud => cloud.update(this.direction));
    },

    /** Génère et ajoute des nuages à la scène */
    startSpawning() {
        setInterval(() => {
            if (this.clouds.length < this.maxClouds) {
                let newCloud = Object.assign({}, CloudGroup);
                newCloud.init(this.scene, this.target, this.direction, this.speed, this.numSpheresPerGroup, this.spawnDistance);
                this.clouds.push(newCloud);
            }
        }, this.spawnRate);
    },

    /** Met à jour la position des nuages */
    update() {
        this.windArrow.updateFrame();
        this.clouds.forEach(cloud => cloud.update(this.direction));

        this.clouds = this.clouds.filter(cloud => {
            if (cloud.group.position.distanceTo(this.target.position) > this.spawnDistance * 1.5) {
                cloud.fadeOut(() => {
                    this.clouds = this.clouds.filter(c => c !== cloud);
                });
                return false;
            }
            return true;
        });
    }
};

/** Objet WindArrow */
const WindArrow = {
    target: null,
    group: null,
    currentWindDirection: new THREE.Vector3(1, 0, 0),

    init(target) {
        this.target = target;
        this.creationArrow();
    },

    creationArrow() {
        this.group = new THREE.Group();

        const stickGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1);
        const stickMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        this.stick = new THREE.Mesh(stickGeometry, stickMaterial);
        this.stick.rotation.x = Math.PI / 2;

        const arrowGeometry = new THREE.ConeGeometry(0.05, 0.2, 3);
        const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.arrow.position.set(0, 0, 0.1);
        this.arrow.rotation.x = Math.PI / 2;

        this.group.add(this.stick);
        this.group.add(this.arrow);
        this.target.add(this.group);
    },

    updateWindDirection(newDirection) {
        this.currentWindDirection.copy(newDirection);
    },

    updateFrame() {
        const angleWind = Math.atan2(-this.currentWindDirection.x, -this.currentWindDirection.z);
        const cameraMatrix = new THREE.Matrix4();
        cameraMatrix.extractRotation(this.target.matrixWorld);
        const cameraDirection = new THREE.Vector3(0, 0, -1).applyMatrix4(cameraMatrix);
        const angleCamera = Math.atan2(cameraDirection.x, cameraDirection.z);
        this.group.rotation.y = angleWind - angleCamera;
    }
};

/** Objet CloudGroup */
const CloudGroup = {
    scene: null,
    target: null,
    speed: null,
    group: null,
    opacity: 0,
    fadeSpeed: 0.02,

    init(scene, target, direction, speed, numSpheres = 15, spawnDistance = 150) {
        this.scene = scene;
        this.target = target;
        this.speed = speed;
        this.group = new THREE.Group();
        this.opacity = 0;

        let lastSphere = null;

        for (let i = 0; i < numSpheres; i++) {
            let radius = THREE.MathUtils.randFloat(4, 10);
            const geometry = new THREE.SphereGeometry(radius, 8, 8);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0.85 + Math.random() * 0.1, 0.85 + Math.random() * 0.1, 0.85 + Math.random() * 0.1),
                transparent: true,
                opacity: this.opacity
            });

            const sphere = new THREE.Mesh(geometry, material);
            sphere.castShadow = true;
            sphere.receiveShadow = true;

            if (lastSphere === null) {
                sphere.position.set(0, 0, 0);
            } else {
                let angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
                let distance = (lastSphere.geometry.parameters.radius + radius) * 0.7;
                sphere.position.set(
                    lastSphere.position.x + Math.cos(angle) * distance,
                    lastSphere.position.y + THREE.MathUtils.randFloat(-2, 2),
                    lastSphere.position.z + Math.sin(angle) * distance
                );
            }

            this.group.add(sphere);
            lastSphere = sphere;
        }

        const distance = spawnDistance + Math.random() * 80;
        const oppositeAngle = Math.atan2(-direction.z, -direction.x);
        const angleVariation = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-30, 30));
        const spawnAngle = oppositeAngle + angleVariation;

        this.group.position.set(
            target.position.x + Math.cos(spawnAngle) * distance,
            50,
            target.position.z + Math.sin(spawnAngle) * distance
        );

        this.direction = direction.clone().multiplyScalar(this.speed);
        scene.add(this.group);
    },

    update(direction) {
        this.direction = direction.clone().multiplyScalar(this.speed);
        this.group.position.add(this.direction);
    },

    fadeOut(callback) {
        this.scene.remove(this.group);
        callback();
    }
};

export { _createClouds };
