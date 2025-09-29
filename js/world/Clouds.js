import * as THREE from 'three';
import { _front } from '../ui/DomHelper.js';

class WindArrow {
    constructor(target) {
        this.target = target;
        this.creationArrow()
        // Stocker la direction actuelle du vent
        this.currentWindDirection = new THREE.Vector3(1, 0, 0);
        let vent = _front.createDiv({
            style:{backgroundColor:"black",position:'absolute',bottom:'10px',right:'10px',width:"30px",height:"30px",transform:"rotate(90deg)"}
        })
        this.windStrengthIndicator = _front.createDiv({
            attributes: { id: 'windStrengthIndicator' },
            style: {
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: '16px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '5px 10px',
                borderRadius: '5px',
            }
        });
        document.body.appendChild(this.windStrengthIndicator);
        this.chaussette = _front.createDiv({
            style:{backgroundColor:"white",width:"30px",height:"30px"}
        })
        let chaussetteIco = _front.createDiv({
            tag:'img',
            style:{width:"30px",height:"30px"},
            attributes:{src:"./assets/fleche.svg",alt:"fleche du vent"}
        })
        this.chaussette.append(chaussetteIco)
        vent.append(this.chaussette)
        document.body.append(vent)
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

    updateFrame(windSpeed = 0) {
        // Calculer l'angle du vent en radians
        const angleWind = Math.atan2(-this.currentWindDirection.x, -this.currentWindDirection.z); // Inversion ici

        if (this.windStrengthIndicator) {
            this.windStrengthIndicator.innerHTML = `Wind: ${(windSpeed * 1000).toFixed(0)}%`;
        }

        // Récupérer la rotation de la caméra via sa matrice
        const cameraMatrix = new THREE.Matrix4();
        cameraMatrix.extractRotation(this.target.matrixWorld);
        const cameraDirection = new THREE.Vector3(0, 0, -1).applyMatrix4(cameraMatrix);

        // Calculer l'angle de la caméra en radians
        const angleCamera = Math.atan2(cameraDirection.x, cameraDirection.z);

        // Ajuster la rotation pour prendre en compte la caméra
        this.group.rotation.y = angleWind - angleCamera;

        const angleDeg = THREE.MathUtils.radToDeg(angleWind - angleCamera);
        this.chaussette.style.transform = "rotate("+-angleDeg+"deg)"

    }

}

class CloudGroup {
    constructor(scene, target, direction, speed, numSpheres = 15, spawnDistance = 150) {
        this.scene = scene;
        this.target = target;
        this.speed = speed;
        this.group = new THREE.Group();
        this.opacity = 0;
        this.fadeSpeed = 0.02;

        let lastSphere = null; // Stocke la dernière sphère pour un placement progressif

        for (let i = 0; i < numSpheres; i++) {
            let radius = THREE.MathUtils.randFloat(4, 10); // Taille aléatoire mais contrôlée
            const geometry = new THREE.SphereGeometry(radius, 8, 8); // Moins de segments pour éviter l'effet "parfait"
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0.85 + Math.random() * 0.1, 0.85 + Math.random() * 0.1, 0.85 + Math.random() * 0.1),
                transparent: true,
                opacity: this.opacity
            });

            const sphere = new THREE.Mesh(geometry, material);
            sphere.castShadow = true;
            sphere.receiveShadow = true;

            if (lastSphere === null) {
                // 🌟 Première sphère = noyau du nuage
                sphere.position.set(0, 0, 0);
            } else {
                // 📌 Nouvelle sphère positionnée à côté de la précédente
                let angle = THREE.MathUtils.randFloat(0, Math.PI * 2); // Angle aléatoire autour
                let distance = (lastSphere.geometry.parameters.radius + radius) * 0.7; // Réduction de l'espace entre sphères

                sphere.position.set(
                    lastSphere.position.x + Math.cos(angle) * distance,
                    lastSphere.position.y + THREE.MathUtils.randFloat(-2, 2), // Légère variation verticale
                    lastSphere.position.z + Math.sin(angle) * distance
                );

                // 🔹 Ajout d'une **légère déformation** pour casser les formes parfaites
                sphere.scale.set(
                    THREE.MathUtils.randFloat(0.9, 1.1),
                    THREE.MathUtils.randFloat(0.8, 1.2),
                    THREE.MathUtils.randFloat(0.9, 1.1)
                );
            }

            this.group.add(sphere);
            lastSphere = sphere;
        }

        // 🔹 Positionnement global du nuage
        const distance = spawnDistance + Math.random() * 80;
        const oppositeAngle = Math.atan2(-direction.z, -direction.x);
        const angleVariation = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-30, 30));
        const spawnAngle = oppositeAngle + angleVariation;

        this.group.position.set(
            target.position.x + Math.cos(spawnAngle) * distance,
            50, // 📌 Encore plus haut pour éviter l'effet "brouillard bas"
            target.position.z + Math.sin(spawnAngle) * distance
        );

        this.direction = direction.clone().multiplyScalar(this.speed);
        scene.add(this.group);
    }

    update(direction) {
        this.direction = direction.clone().multiplyScalar(this.speed);
        this.group.position.add(this.direction);

        if (this.opacity < 0.8) {
            this.opacity = Math.min(this.opacity + this.fadeSpeed, 1);
            this.group.children.forEach(sphere => {
                sphere.material.opacity = this.opacity;
            });
        }
    }

    fadeOut(callback) {
        const fadeInterval = setInterval(() => {
            if (this.opacity > 0) {
                this.opacity -= this.fadeSpeed;
                this.group.children.forEach(sphere => {
                    sphere.material.opacity = Math.max(this.opacity, 0);
                });
            } else {
                clearInterval(fadeInterval);
                this.scene.remove(this.group);
                callback();
            }
        }, 50);
    }
}

class _createClouds {
    constructor(scene, target, maxClouds = 70, spawnRate = 1500, numSpheresPerGroup = 5, spawnDistance = 200, speed = 0.05, directionChangeRate = 15000) {
        console.log('[nuages2.js] _createClouds constructor called');
        this.scene = scene;
        this.target = target;
        this.maxClouds = maxClouds;
        this.spawnRate = spawnRate;
        this.numSpheresPerGroup = numSpheresPerGroup;
        this.spawnDistance = spawnDistance;
        this.speed = speed;
        this.clouds = [];
        this.direction = this.generateRandomDirection();

        this.windArrow = new WindArrow(target);
        this.windArrow.updateWindDirection(this.direction);
        this.windArrow.updateFrame(this.speed);

        this.startSpawning();
        this.changeDirectionPeriodically(directionChangeRate);
    }

    generateRandomDirection(previousDirection = null) {
        let angleChange = (Math.random() * 40 - 20) * (Math.PI / 180); // ±20° de variation

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
            // console.log("Nouvelle direction des nuages :", this.direction);
        }, interval);
    }

    setWindDirection(newDirection) {
        this.direction.copy(newDirection);
        this.windArrow.updateWindDirection(this.direction);
        this.clouds.forEach(cloud => cloud.update(this.direction));

        const angleRad = Math.atan2(this.direction.x, this.direction.z);
        const angleDeg = THREE.MathUtils.radToDeg(angleRad);

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
                const newCloud = new CloudGroup(this.scene, this.target, this.direction, this.speed, this.numSpheresPerGroup, this.spawnDistance);
                this.clouds.push(newCloud);
            }
        }, this.spawnRate);
    }

    update() {
        this.windArrow.updateFrame(this.speed);

        this.clouds.forEach(cloud => cloud.update(this.direction));

        // Supprimer les nuages trop éloignés avec effet de fondu
        this.clouds = this.clouds.filter(cloud => {
            if (cloud.group.position.distanceTo(this.target.position) > this.spawnDistance *1.5) {
                cloud.fadeOut(() => {
                    this.clouds = this.clouds.filter(c => c !== cloud);
                });
                return false;
            }
            return true;
        });
    }
}

export { _createClouds };