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
        0: { name: "simple", longueur: 2, diametre: 0.045, bonus: { power: 0.2, windResist: 0.002, gravityResist: 0.0002 }, color: 0xffff00,
            userData: {
                dt: 0.2, // Temps simulé par frame (~60 FPS)
                friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
                mass: 0.08, // Masse fictive
                gravityScale: 1, // Réduction de l'effet de la gravité
            }
        },
        1: { name: "moyenne", longueur: 2, diametre: 0.05, bonus: { power: 0.3, windResist: 0.003, gravityResist: 0.0003 }, color: 0xffff00,
            userData: {
                dt: 0.2, // Temps simulé par frame (~60 FPS)
                friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
                mass: 0.08, // Masse fictive
                gravityScale: 1, // Réduction de l'effet de la gravité
            }
        },
        2: { name: "avancée", longueur: 2, diametre: 0.05, bonus: { power: 1.5, windResist: 0.004, gravityResist: 0.2 }, color: 0xff00ff,
            userData: {
                dt: 0.2, // Temps simulé par frame (~60 FPS)
                friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
                mass: 0.08, // Masse fictive
                gravityScale: 1, // Réduction de l'effet de la gravité
            }
        }
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
    Font: undefined,

    init: function (_scene, _cibles, _score, gravity, Font) {
        console.log('[arrows5.js] _arrows.init() called');
        this.Font = Font;
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
        if(!cibleMesh.userData.points) cibleMesh.userData.points=0
        this.ToutesLesCible.push(cibleMesh);
    },

    shootArrow: function () {
        if (_arrows.arrows.length >= _arrows.maxArrows) {
            _arrows.resetArrows();
        }

        const arrowGeometry = new THREE.CylinderGeometry(
            _arrows.arrowModel.diametre,
            _arrows.arrowModel.diametre,
            _arrows.arrowModel.longueur,
            10
        );
        const arrowMaterial = new THREE.MeshStandardMaterial({
            color: _arrows.arrowModel.color,
            emissive: 0xffff00
        });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);

        // 🔴 Pointe de la flèche (collision)
        const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const arrowTip = new THREE.Mesh(sphereGeometry, sphereMaterial);
        arrowTip.position.set(0, _arrows.arrowModel.longueur / 2, 0);
        arrow.add(arrowTip);

        let arrowPosition = new THREE.Vector3();
        _arrows._scene.camera.getWorldPosition(arrowPosition);
        let forward = new THREE.Vector3();
        _arrows._scene.camera.getWorldDirection(forward);
        arrowPosition.addScaledVector(forward, 1.5);
        arrow.position.copy(arrowPosition);

        let baseSpeed = _arrows.bowModel.speed;
        let arrowBonus = _arrows.arrowModel.bonus.power;
        let initialVelocity = forward.clone().multiplyScalar(baseSpeed + arrowBonus);

        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), initialVelocity.clone().normalize());

        console.log(`🏹 Flèche tirée ! Vitesse initiale : ${initialVelocity.length().toFixed(2)}`);

        _arrows.arrows.push({
            mesh: arrow,
            tip: arrowTip,
            velocity: initialVelocity,
            stopped: false,
            userData: _arrows.arrowModel.userData
        });

        _arrows.shootedArrows++;
        _arrows._scene.scene.add(arrow);
        new Audio('./assets/whoosh.mp3').play();
    },

    checkCollision: function (arrow, previousPosition) {
        if (arrow.stopped) return;

        const currentPosition = arrow.mesh.position;
        const displacement = new THREE.Vector3().subVectors(currentPosition, previousPosition);
        const distance = displacement.length();

        if (distance === 0) return;

        const raycaster = new THREE.Raycaster(
            previousPosition,
            displacement.normalize(),
            0,
            distance
        );

        const intersects = raycaster.intersectObjects(this.ToutesLesCible, true);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            console.log("💥 Collision détectée via Raycaster !");

            // Placer la flèche exactement au point d'impact
            arrow.mesh.position.copy(intersection.point);

            arrow.velocity.set(0, 0, 0);
            arrow.stopped = true;

            // Ajouter des points au score
            if (intersection.object.userData.points) {
                this._score.addToScore(intersection.object.userData.points);
            }

            new Audio('./assets/whoosh.mp3').play();

            return; // Sortir après la première collision
        }

        this.checkGroundCollision(arrow);
    },

    checkArrows: function () {
        this.arrows.forEach(arrow => {
            if (!arrow.stopped) {
                let dt = arrow.userData.dt;
                let friction = arrow.userData.friction;
                let mass = arrow.userData.mass;
                let gravityScale = arrow.userData.gravityScale;

                let forceGravity = _arrows.gravity.clone().multiplyScalar(mass * gravityScale);
                let forceFriction = arrow.velocity.clone().multiplyScalar(-friction);

                let totalForce = forceGravity.add(forceFriction);
                let acceleration = totalForce.divideScalar(mass);

                arrow.velocity.add(acceleration.multiplyScalar(dt));

                const previousPosition = arrow.mesh.position.clone();
                arrow.mesh.position.add(arrow.velocity.clone().multiplyScalar(dt));

                // **Tourner la flèche pour suivre la trajectoire**
                if (arrow.velocity.length() > 0) {
                    arrow.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrow.velocity.clone().normalize());
                }

                this.checkCollision(arrow, previousPosition);
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