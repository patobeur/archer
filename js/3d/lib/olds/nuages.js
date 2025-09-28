import * as THREE from 'three';
import { _front } from '../../../front.js';

class WindArrow {
    constructor(target) {
        this.target = target;
        this.creationArrow()
        // Stocker la direction actuelle du vent
        this.currentWindDirection = new THREE.Vector3(1, 0, 0);
    }

    creationArrow(newDirection) {
        this.group = new THREE.Group();
        // Création de la tige de la flèche (cylindre)
        const stickGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1);
        const stickMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        this.stick = new THREE.Mesh(stickGeometry, stickMaterial);
        this.stick.position.set(0, 0, 0); // Centrer sur l'origine
        this.stick.rotation.x = Math.PI/2

        // Création de la flèche (cône)
        const arrowGeometry = new THREE.ConeGeometry(0.05, .2, 3);
        const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.arrow.position.set(0, 0, .1); // Décalage en Z pour pointer horizontalement
        this.arrow.rotation.x = Math.PI / 2; // La flèche est à l’horizontale

        // Ajouter les éléments au groupe
        this.group.add(this.stick);
        this.group.add(this.arrow);

        // Positionner la flèche derrière le `target`
        this.group.position.set(0, -0.5, -4);
        this.target.add(this.group);

    }
    updateWindDirection(newDirection) {
        this.currentWindDirection.copy(newDirection);
    }

    updateFrame() {
        // Calculer l'angle du vent en radians
        const angleWind = Math.atan2(-this.currentWindDirection.x, -this.currentWindDirection.z); // Inversion ici
    
        // Récupérer la rotation de la caméra via sa matrice
        const cameraMatrix = new THREE.Matrix4();
        cameraMatrix.extractRotation(this.target.matrixWorld);
        const cameraDirection = new THREE.Vector3(0, 0, -1).applyMatrix4(cameraMatrix);
    
        // Calculer l'angle de la caméra en radians
        const angleCamera = Math.atan2(cameraDirection.x, cameraDirection.z);
    
        // Ajuster la rotation pour prendre en compte la caméra
        this.group.rotation.y = angleWind - angleCamera;
    }
    
}


class CloudGroup {
    constructor(scene, target, direction, speed, numCubes = 4, spawnDistance = 100) {
        this.scene = scene;
        this.target = target;
        this.speed = speed;
        this.group = new THREE.Group();
        this.opacity = 0; // Début avec une opacité à 0 pour effet de fondu
        this.fadeSpeed = 0.02; // Vitesse d'apparition et disparition

        for (let i = 0; i < numCubes; i++) {
            let sizes = {
                x: _front.rand(5,20),
                y: _front.rand(4,5),
                z: _front.rand(5,20),
            }
            const geometry = new THREE.BoxGeometry(sizes.x,sizes.y,sizes.z);

            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(
                    0.95 + Math.random() * 0.05, 
                    0.95 + Math.random() * 0.05, 
                    0.95 + Math.random() * 0.05),
                transparent: true,
                opacity: this.opacity
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.castShadow = true;
            cube.receiveShadow = true;

            // Position aléatoire à l'intérieur du groupe
            cube.position.set(
                _front.rand(-sizes.x/3,sizes.x),
                _front.rand(-sizes.y/2,sizes.y), // Hauteur entre 9.5 et 10.5
                _front.rand(-sizes.z/3,sizes.z)
            );

            this.group.add(cube);
        }

        // Générer une position à l'opposé du vent
        const distance = spawnDistance + Math.random() * 30;
        const oppositeAngle = Math.atan2(-direction.z, -direction.x); // Angle opposé à la direction du vent
        const angleVariation = (Math.random() * 40 - 20) * (Math.PI / 180); // Variation de ±20° max
        const spawnAngle = oppositeAngle + angleVariation;

        this.group.position.set(
            target.position.x + Math.cos(spawnAngle) * distance,
            15, // Hauteur fixe avec légère variation
            target.position.z + Math.sin(spawnAngle) * distance
        );

        // Appliquer la direction générale de déplacement
        this.direction = direction.clone().multiplyScalar(this.speed);

        scene.add(this.group);
    }

    update(direction) {
        this.direction = direction.clone().multiplyScalar(this.speed);
        this.group.position.add(this.direction);

        // Effet de fondu à l'apparition
        if (this.opacity < 1) {
            let newopacity = this.opacity + this.fadeSpeed;
            if (newopacity > 1) newopacity = 1 ;
            this.opacity = newopacity;
            this.group.children.forEach(cube => {
                cube.material.opacity = Math.min(this.opacity, 1);
            });
        }
    }

    fadeOut(callback) {
        // Effet de disparition progressive
        const fadeInterval = setInterval(() => {
            if (this.opacity > 0) {
                this.opacity -= this.fadeSpeed;
                this.group.children.forEach(cube => {
                    cube.material.opacity = Math.max(this.opacity, 0);
                });
            } else {
                clearInterval(fadeInterval);
                this.scene.remove(this.group);
                callback(); // Supprime le nuage du tableau
            }
        }, 50);
    }
}

class _CubeManager {
    constructor(scene, target, maxClouds = 10, spawnRate = 2000, numCubesPerGroup = 3, spawnDistance = 30, speed = 0.02, directionChangeRate = 10000) {
        this.scene = scene;
        this.target = target;
        this.maxClouds = maxClouds;
        this.spawnRate = spawnRate;
        this.numCubesPerGroup = numCubesPerGroup;
        this.spawnDistance = spawnDistance;
        this.speed = speed;
        this.clouds = [];
        this.direction = this.generateRandomDirection();
        
        this.windArrow = new WindArrow(target);
        this.windArrow.updateFrame(this.direction);

        this.startSpawning();
        this.changeDirectionPeriodically(directionChangeRate);
    }
    generateRandomDirection(previousDirection = null) {
        let angleChange = (Math.random() * 40 - 20) * (Math.PI / 180); // Changement limité à ±20°
        
        if (previousDirection) {
            let currentAngle = Math.atan2(previousDirection.z, previousDirection.x);
            let newAngle = currentAngle + angleChange;
            return new THREE.Vector3(Math.cos(newAngle), 0, Math.sin(newAngle)).normalize();
        } else {
            
            return new THREE.Vector3(
                Math.random() * 2 - 1, // X entre -1 et 1
                0,                     // Pas de mouvement vertical
                Math.random() * 2 - 1  // Z entre -1 et 1
            ).normalize();
        }
    }

    changeDirectionPeriodically(interval) {
        setInterval(() => {
            this.setWindDirection(this.generateRandomDirection(this.direction));
            console.log("Nouvelle direction des nuages :", this.direction);
        }, interval);
    }
    setWindDirection(newDirection) {
        this.direction.copy(newDirection); // Stocker la nouvelle direction du vent
        this.windArrow.updateWindDirection(this.direction); // Mettre à jour la flèche
        this.clouds.forEach(cloud => cloud.update(this.direction));
    
        // Calcul de l'angle en radians et en degrés
        const angleRad = Math.atan2(this.direction.x, this.direction.z);
        const angleDeg = THREE.MathUtils.radToDeg(angleRad);
    
        // Affichage des informations dans la console
        console.log(`🌬️ Nouvelle direction du vent:
        - Radians: ${angleRad.toFixed(3)}
        - Degrés: ${angleDeg.toFixed(1)}°
        - Vitesse: ${this.speed.toFixed(3)}`);
    }
    
    setWindSpeed(newSpeed) {
        this.speed = newSpeed;
        this.clouds.forEach(cloud => cloud.speed = this.speed);
    }

    getWindDirection() {
        return this.direction.clone();
    }

    getWindSpeed() {
        return this.speed;
    }

    startSpawning() {
        setInterval(() => {
            if (this.clouds.length < this.maxClouds) {
                const newCloud = new CloudGroup(this.scene, this.target, this.direction, this.speed, this.numCubesPerGroup, this.spawnDistance);
                this.clouds.push(newCloud);
            }
        }, this.spawnRate);
    }

    update() {
        this.windArrow.updateFrame(); // Mise à jour continue de la flèche
    
        this.clouds.forEach(cloud => cloud.update(this.direction));
    
        // Supprimer les nuages trop éloignés avec effet de fondu
        this.clouds = this.clouds.filter(cloud => {
            if (cloud.group.position.distanceTo(this.target.position) > this.spawnDistance+20 ) {
                cloud.fadeOut(() => {
                    this.clouds = this.clouds.filter(c => c !== cloud);
                });
                return false;
            }
            return true;
        });
    }
    
    
}

export { _CubeManager };
