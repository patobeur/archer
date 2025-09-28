import * as THREE from 'three';
const _equipements = {
    bows:{
        0 : { 
            name: "arc classique enfant",
            power:1, // en livres (1lbs=450grammes)
            length:1.3, // taille de l'arc en unité
        },
        1 : { name: "arc classique moyen", power:1.5, length:1.5,},
        2 : { name: "arc classique adulte", power:1.8, length:1.7,},
        3 : { name: "arc long enfant", power:1.3, length:1.6,},
        4 : { name: "arc long moyen", power:1.8, length:1.8,},
        5 : { name: "arc long adulte", power:2, length:2.0,},
    },
    arrows:{
        0 : { 
            name: "simple",
            longueur: 2, // longueur de la fleche en unité
            diametre:0.045, // épaisseur de la fleche  en unité
            bonus:{
                power:0.2, // bonus qui s'applique a la trajectoire de tir
                windResist:0.002, // bonus qui s'applique a la trajectoire de tir
                gravityResist:0.0002, // bonus qui s'applique a la trajectoire de tir 1 = no gravity
            }
        },
        1 : { name: "moyenne", longueur:2, diametre:0.05, bonus:{power:0.3,windResist:0.003,gravityResist:0.0003}},
        2 : { name: "avancée", longueur:2, diametre:0.05, bonus:{power:1.5,windResist:0.004,gravityResist:.2}}
    },
}
const _arrows = {
    arrowDatas: { 'basic': { length: 3 } },
    arrows: [],
    maxArrows: 15,
    shootedArrows: 0,
    _scene: undefined,
    bowModel: undefined,
    arrowModel: undefined,
    ToutesLesCible:[],
    impactSound: undefined,

    init: function (_scene, _cibles, _score, raycaster, gravity) {
        // 🎵 Jouer un son d’impact
        this.impactSound = new Audio('./assets/whoosh.mp3'); // Ajoute un son de collision
        this.bowModel = _equipements.bows[2]
        this.arrowModel = _equipements.arrows[2]
        this._cibles = _cibles;
        this._cibles.cible.children.forEach(element => {
            this.ToutesLesCible.push(element)
        });
        console.log(this.ToutesLesCible)
        this._score = _score;
        this._scene = _scene;
        this.raycaster = raycaster;
        this.gravity = gravity;
        document.addEventListener('click', _arrows.shootArrow);
    },

    addCible: function (cibleMesh) {
        this.ToutesLesCible.push(cibleMesh)
    },

    shootArrow: function () {
        console.log(_arrows.arrows.length, '/', _arrows.maxArrows, '/', _arrows.shootedArrows);
        if (_arrows.arrows.length >= _arrows.maxArrows) {
            _arrows.resetArrows();
        }
    
        _arrows.impactSound.play();
        const arrowGeometry = new THREE.CylinderGeometry(_arrows.arrowModel.diametre, _arrows.arrowModel.diametre, _arrows.arrowModel.longueur, 10);
        const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xffff00 });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    
        // 🔴 Ajouter une petite sphère rouge à la pointe de la flèche
        const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8); // Taille ajustable
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const arrowTip = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        arrow.add(arrowTip); // La sphère est attachée à la flèche
        arrowTip.position.set(0, _arrows.arrowModel.longueur / 2, 0); // Pointe à l'extrémité avant
    
        // Positionner la flèche devant la caméra
        let arrowPosition = new THREE.Vector3();
        _arrows._scene.camera.getWorldPosition(arrowPosition);
        let forward = new THREE.Vector3();
        _arrows._scene.camera.getWorldDirection(forward);
        arrowPosition.addScaledVector(forward, 1.5);
        arrow.position.copy(arrowPosition);
    
        arrow.castShadow = true;
        arrow.receiveShadow = true;
    
        let basePower = _arrows.bowModel.power;
        let arrowBonus = _arrows.arrowModel.bonus.power;
        let velocity = forward.clone().multiplyScalar(basePower + arrowBonus);
    
        // Aligner la flèche avec la direction de tir
        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), velocity.clone().normalize());
    
        _arrows.arrows.push({ mesh: arrow, tip: arrowTip, velocity, stopped: false });
        _arrows.shootedArrows++;
        _arrows._scene.scene.add(arrow);
    },

    
    shootArrow2: function () {
        console.log(_arrows.arrows.length, '/', _arrows.maxArrows, '/', _arrows.shootedArrows);
        if (_arrows.arrows.length >= _arrows.maxArrows) {
            _arrows.resetArrows();
        }

        const arrowGeometry = new THREE.CylinderGeometry(0.045, 0.045, _arrows.arrowDatas.basic.length, 10);
        const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xffff00 });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);

        // Positionner la flèche devant la caméra
        let arrowPosition = new THREE.Vector3();
        _arrows._scene.camera.getWorldPosition(arrowPosition);
        let forward = new THREE.Vector3();
        _arrows._scene.camera.getWorldDirection(forward);
        arrowPosition.addScaledVector(forward, 1.5);
        arrow.position.copy(arrowPosition);

        arrow.castShadow = true;
        arrow.receiveShadow = true;

        // let velocity = forward.clone().multiplyScalar(1.5);
        
        let basePower = _arrows.bowModel.power;
        let arrowBonus = _arrows.arrowModel.bonus.power;
        let velocity = forward.clone().multiplyScalar(basePower + arrowBonus);

        // Aligner la flèche avec la direction de tir
        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), velocity.clone().normalize());

        _arrows.arrows.push({ mesh: arrow, velocity, stopped: false });
        _arrows.shootedArrows++;
        _arrows._scene.scene.add(arrow);
    },

    checkCollision: function (arrow) {
        if (arrow.stopped) return;
    
        let tipPosition = new THREE.Vector3();
        arrow.tip.getWorldPosition(tipPosition); // On récupère la position de la sphère
    
        this.ToutesLesCible.forEach(cible => {
            let distance = tipPosition.distanceTo(cible.position);
            let hitThreshold = cible.scale.x / 2; // Ajuster en fonction de la taille de la cible
    
            if (distance < hitThreshold) {
                console.log("💥 Collision détectée !");
    
                // Vérifier l’angle d’impact
                // let normal = new THREE.Vector3(0, 0, -1); // Exemple normal (cible perpendiculaire)
                // let impactAngle = arrow.velocity.angleTo(normal) * (180 / Math.PI);
                // if (impactAngle > 120) return; // Trop rasant, on ignore
    
                // Ajouter des points si la cible en a
                if (cible.userData.points) {
                    this._score.addToScore(cible.userData.points);
                }
    
                // Planter la flèche dans la cible
                arrow.mesh.position.copy(tipPosition);
                arrow.stopped = true;

                // new TWEEN.Tween(arrow.mesh.position)
                //     .to({ x: tipPosition.x + 0.1, y: tipPosition.y, z: tipPosition.z }, 50)
                //     .yoyo(true)
                //     .repeat(3)
                //     .start();



            }
        });
    },

    
    checkCollision1: function (arrow) {
        if (arrow.stopped) return;
    
        this.ToutesLesCible.forEach(cible => {
            let arrowStart = arrow.mesh.position.clone();
            let arrowEnd = arrowStart.clone().add(arrow.velocity.clone().normalize().multiplyScalar(_arrows.arrowModel.longueur));
    
            let hitThreshold = cible.scale.x / 2; // Taille approximative de la cible
    
            // Vérifie si au moins un point de la flèche est proche de la cible
            let numSegments = 5; // Nombre de points à tester le long de la flèche
            for (let i = 0; i <= numSegments; i++) {
                let interpolationFactor = i / numSegments;
                let testPoint = new THREE.Vector3().lerpVectors(arrowStart, arrowEnd, interpolationFactor);
                let distance = testPoint.distanceTo(cible.position);
    
                if (distance < hitThreshold) {
                    console.log("Collision détectée !");
                    
                    // Ajouter des points si la cible en a
                    if (cible.userData.points) {
                        this._score.addToScore(cible.userData.points);
                    }
    
                    // Planter la flèche dans la cible
                    arrow.mesh.position.copy(testPoint);
                    arrow.stopped = true;
                    return;
                }
            }
        });
    },



    checkCollision2: function (arrow) {
        if (arrow.stopped) return;

        let direction = arrow.velocity.clone().normalize();
        this.raycaster.set(arrow.mesh.position, direction);
        const intersects = this.raycaster.intersectObjects(this.ToutesLesCible, true);

        if (intersects.length > 0) {
            let impact = intersects[0];

            // Ajouter des points au score
            this._score.addToScore(impact.object.userData.points);

            // Positionner la flèche avec un léger enfoncement
            arrow.mesh.position.copy(impact.point);
            let penetration = -(this.arrowDatas.basic.length / 2)// + (this.arrowDatas.basic.length / 3);
            arrow.mesh.position.addScaledVector(direction, penetration);

            // **Corriger l'orientation pour qu'elle suive la trajectoire**
            arrow.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

            arrow.stopped = true;
        }
    },

    checkGroundCollision: function (arrow) {
        if (arrow.stopped) return;

        // Vérifier si la flèche touche le sol (z = 0)
        if (arrow.mesh.position.y <= 0) {
            arrow.mesh.position.y = 0;

            // **Planter la flèche dans le sol en conservant son angle**
            // let impactDirection = arrow.velocity.clone().normalize();
            // arrow.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), impactDirection);

            arrow.stopped = true;
        }
    },

    resetArrows: function () {
        _arrows.arrows.forEach(arrow => _arrows._scene.scene.remove(arrow.mesh));
        _arrows.arrows = [];
    },

    checkArrows: function () {
        this.arrows.forEach(arrow => {
            if (!arrow.stopped) {
                
                let windResistance = _arrows.arrowModel.bonus.windResist;
                let gravityEffect = _arrows.gravity.clone().multiplyScalar(1 - _arrows.arrowModel.bonus.gravityResist);
                arrow.velocity.add(gravityEffect);
                arrow.velocity.multiplyScalar(1 - windResistance);

                // arrow.velocity.add(this.gravity);
                arrow.mesh.position.add(arrow.velocity);

                // **Mise à jour de l'orientation de la flèche**
                arrow.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrow.velocity.clone().normalize());

                this.checkCollision(arrow); // Vérifie la collision avec la cible
                this.checkGroundCollision(arrow); // Vérifie la collision avec le sol
            }
        });
    }
};

export { _arrows };
