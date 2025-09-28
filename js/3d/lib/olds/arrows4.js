import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { MeshBasicMaterial } from 'three';

const _labels = {
    getLabels: function (font, txt) {
        const speedTextGeometry = new TextGeometry(txt, {
            font: font,
            size: 0.2,
            height: 0.02
        });
        const speedTextMaterial = new MeshBasicMaterial({ color: 0xffffff });
        const speedText = new THREE.Mesh(speedTextGeometry, speedTextMaterial);

        // 🏹 Créer un groupe pour le texte
        const speedTextGroup = new THREE.Group();
        speedTextGroup.add(speedText);

        // **Corriger la rotation initiale du texte**
        speedText.rotation.y = -Math.PI / 2; // Remettre le texte debout

        return speedTextGroup;
    }
};

const _equipements = {
    bows: {
        0: { name: "arc classique enfant", power: 1, speed: 5, length: 1.3 },
        1: { name: "arc classique moyen", power: 1.5, speed: 7, length: 1.5 },
        2: { name: "arc classique adulte", power: 1.8, speed: 8, length: 1.7 },
        3: { name: "arc long enfant", power: 1.3, speed: 6, length: 1.6 },
        4: { name: "arc long moyen", power: 1.8, speed: 9, length: 1.8 },
        5: { name: "arc long adulte", power: 2, speed: 10, length: 2.0 },
    },
    
    arrows: {
        0: { name: "simple", longueur: 2, diametre: 0.045, bonus: { power: 0.2, windResist: 0.002, gravityResist: 0.0002 }, color: 0xffff00 },
        1: { name: "moyenne", longueur: 2, diametre: 0.05, bonus: { power: 0.3, windResist: 0.003, gravityResist: 0.0003 }, color: 0xffff00 },
        2: { name: "avancée", longueur: 2, diametre: 0.05, bonus: { power: 1.5, windResist: 0.004, gravityResist: 0.2 }, color: 0xff00ff }
    }
};

const _arrows = {
    arrows: [],
    maxArrows: 15,
    shootedArrows: 0,
    _scene: undefined,
    bowModel: undefined,
    arrowModel: undefined,
    ToutesLesCible: [],
    impactSound: undefined,
    Font: undefined,

    init: function (_scene, _cibles, _score, gravity, Font) {
        this.Font = Font;
        this.impactSound = new Audio('./assets/whoosh.mp3');
        this.bowModel = _equipements.bows[2];
        this.arrowModel = _equipements.arrows[2];
        this._cibles = _cibles;
        this._cibles.cible.children.forEach(element => {
            this.ToutesLesCible.push(element);
        });
        console.log(this.ToutesLesCible);
        this._score = _score;
        this._scene = _scene;
        this.gravity = gravity;
        document.addEventListener('click', _arrows.shootArrow);
    },

    addCible: function (cibleMesh) {
        this.ToutesLesCible.push(cibleMesh);
    },

    shootArrow: function () {
        if (_arrows.arrows.length >= _arrows.maxArrows) {
            _arrows.resetArrows();
        }

        // 🔴 Créer la sphère qui sert de collision
        const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const arrowTip = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        // 🏹 Créer la flèche (fixée à la sphère)
        const arrowGeometry = new THREE.CylinderGeometry(_arrows.arrowModel.diametre, _arrows.arrowModel.diametre, _arrows.arrowModel.longueur, 10);
        const arrowMaterial = new THREE.MeshStandardMaterial({ color: _arrows.arrowModel.color, emissive: 0xffff00 });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.set(0, -_arrows.arrowModel.longueur / 2, 0); // Décalage pour qu'elle suive la sphère
        arrowTip.add(arrow); // La flèche devient un enfant de la sphère

        // 🌍 Définir la position initiale
        let arrowPosition = new THREE.Vector3();
        _arrows._scene.camera.getWorldPosition(arrowPosition);
        let forward = new THREE.Vector3();
        _arrows._scene.camera.getWorldDirection(forward);
        arrowPosition.addScaledVector(forward, 1.5);
        arrowTip.position.copy(arrowPosition);

        // 💨 Calcul de la vélocité
        let baseSpeed = _arrows.bowModel.speed;
        let arrowBonus = _arrows.arrowModel.bonus.power;
        let velocity = forward.clone().multiplyScalar(baseSpeed + arrowBonus);
        
        // 🏹 Orientation de la flèche
        arrowTip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), velocity.clone().normalize());

        // 🏷️ Ajouter le texte de la vitesse
        let label = _labels.getLabels(_arrows.Font, velocity.length().toFixed(2) + " m/s");
        label.position.set(0, 0.2, 0);
        arrowTip.add(label);

        _arrows.arrows.push({ mesh: arrowTip, tip: arrowTip, velocity, stopped: false });
        _arrows.shootedArrows++;
        _arrows._scene.scene.add(arrowTip);
    },

    checkCollision: function (arrow) {
        if (arrow.stopped) return;

        let previousPosition = arrow.mesh.position.clone();
        let numSteps = 10; // Augmente la précision
        
        this.ToutesLesCible.forEach(cible => {
            if (!cible.boundingBox) {
                cible.boundingBox = new THREE.Box3().setFromObject(cible);
            }
            for (let i = 1; i <= numSteps; i++) {
                let factor = i / numSteps;
                let interpolatedPosition = new THREE.Vector3().lerpVectors(previousPosition, arrow.mesh.position, factor);

                let testSphere = new THREE.Sphere(interpolatedPosition, 0.05); // Utilisation d'une bounding sphere
                if (cible.boundingBox.intersectsSphere(testSphere)) {
                    console.log("💥 Collision détectée !");
                    arrow.velocity.set(0, 0, 0);
                    arrow.stopped = true;
                    return;
                }
            }
            this.checkGroundCollision(arrow);
        });
    },

    checkArrows: function () {
        this.arrows.forEach(arrow => {
            if (!arrow.stopped) {
                let gravityEffect = _arrows.gravity.clone().multiplyScalar(1 - _arrows.arrowModel.bonus.gravityResist);
                arrow.velocity.add(gravityEffect);
                arrow.mesh.position.add(arrow.velocity);

                // **Faire tourner la flèche selon sa trajectoire**
                arrow.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrow.velocity.clone().normalize());

                this.checkCollision(arrow);
            }
        });
    },
    checkGroundCollision: function (arrow) {
        if (arrow.stopped) return;
        // Vérifier si la flèche touche le sol (z = 0)
        if (arrow.mesh.position.y <= 0) {
            arrow.mesh.position.y = 0;
            arrow.stopped = true;
        }
    },
    resetArrows: function () {
        _arrows.arrows.forEach(arrow => _arrows._scene.scene.remove(arrow.mesh));
        _arrows.arrows = [];
    },
};

export { _arrows };
