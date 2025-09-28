import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { MeshBasicMaterial } from 'three';

const _labels = {
    getLabels:function(font,txt){
        const speedTextGeometry = new TextGeometry(
            txt, //velocity.length().toFixed(2) + " m/s",
            {
            font: font,
            size: 0.2,
            height: 0.02
            }
        );
        const speedTextMaterial = new MeshBasicMaterial({ color: 0xffffff });
        const speedText = new THREE.Mesh(speedTextGeometry, speedTextMaterial);

        // 🏹 Créer un groupe pour le texte
        const speedTextGroup = new THREE.Group();
        speedTextGroup.add(speedText);

        // **Corriger la rotation initiale du texte**
        speedText.rotation.y = -Math.PI / 2; // Remettre le texte debout

        // **Positionner le texte correctement par rapport à la flèche**
        speedTextGroup.position.set(0, 0, 0);

        // ✅ **Attacher le texte à la flèche pour qu'il la suive**
        return speedTextGroup;
    }
}
const _equipements = {
    bows: {
        0: { name: "arc classique enfant", power: 1, speed: 5, length: 1.3 },
        1: { name: "arc classique moyen", power: 1.5, speed: 7, length: 1.5 },
        2: { name: "arc classique adulte", power: 1.8, speed: 8, length: 1.7 },
        3: { name: "arc long enfant", power: 1.3, speed: 6, length: 1.6 },
        4: { name: "arc long moyen", power: 1.8, speed: 9, length: 1.8 },
        5: { name: "arc long adulte", power: 2, speed: 10, length: 2.0 },
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
            },color:0xffff00
        },
        1 : { name: "moyenne", longueur:2, diametre:0.05, bonus:{power:0.3,windResist:0.003,gravityResist:0.0003},color:0xffff00},
        2 : { name: "avancée", longueur:2, diametre:0.05, bonus:{power:1.5,windResist:0.004,gravityResist:.2},color:0xff00ff}
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
    Font: undefined,

    init: function (_scene, _cibles, _score, gravity,Font) {
        this.Font = Font
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
        this.gravity = gravity;
        document.addEventListener('click', _arrows.shootArrow);
        
    },

    addCible: function (cibleMesh) {
        this.ToutesLesCible.push(cibleMesh)
    },

    shootArrow: function () {
        if (_arrows.arrows.length >= _arrows.maxArrows) {
            _arrows.resetArrows();
        }
    
        const arrowGeometry = new THREE.CylinderGeometry(_arrows.arrowModel.diametre,_arrows.arrowModel.diametre, _arrows.arrowModel.longueur , 10);
        const arrowMaterial = new THREE.MeshStandardMaterial({ color: _arrows.arrowModel.color, emissive: 0xffff00 });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    
        // 🔴 Pointe de la flèche (sphère)
        const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const arrowTip = new THREE.Mesh(sphereGeometry, sphereMaterial);
        arrow.add(arrowTip);
        arrowTip.position.set(0, _arrows.arrowModel.longueur / 2, 0);
    
        // Créer une BoundingBox pour la flèche
        arrow.boundingBox = new THREE.Box3().setFromObject(arrow);
    
        let arrowPosition = new THREE.Vector3();
        _arrows._scene.camera.getWorldPosition(arrowPosition);
        let forward = new THREE.Vector3();
        _arrows._scene.camera.getWorldDirection(forward);
        arrowPosition.addScaledVector(forward, 1.5);
        arrow.position.copy(arrowPosition);

        let baseSpeed = _arrows.bowModel.speed;
        let arrowBonus = _arrows.arrowModel.bonus.power;
        let velocity = forward.clone().multiplyScalar(baseSpeed + arrowBonus);
    
        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), velocity.clone().normalize());
    
        console.log(`🏹 Flèche tirée ! Vitesse : ${velocity.length().toFixed(2)}`);

        //----------------------------------------------------
        let label = _labels.getLabels(_arrows.Font,velocity.length().toFixed(2) + " m/s")

        arrow.add(label);

        // Stocker la référence pour mise à jour
        arrow.speedText = label;
        //----------------------------------------------------    
        
        _arrows.arrows.push({ mesh: arrow, tip: arrowTip, velocity, stopped: false });
        _arrows.shootedArrows++;
        _arrows._scene.scene.add(arrow);

    },
    
    checkCollision: function (arrow) {
        if (arrow.stopped) return;
    
        let previousPosition = arrow.mesh.position.clone(); // Sauvegarde la position avant mouvement
        arrow.mesh.boundingBox.setFromObject(arrow.mesh);
    
        this.ToutesLesCible.forEach(cible => {
            if (!cible.boundingBox) {
                cible.boundingBox = new THREE.Box3().setFromObject(cible);
            }
    
            // Vérifier l'interpolation pour éviter que la flèche passe à travers
            let numSteps = 10; // Augmente la précision
            for (let i = 1; i <= numSteps; i++) {
                let factor = i / numSteps;
                let interpolatedPosition = new THREE.Vector3().lerpVectors(previousPosition, arrow.mesh.position, factor);
    
                let testBox = new THREE.Box3().setFromObject(arrow.mesh);
                testBox.translate(interpolatedPosition.clone().sub(arrow.mesh.position));
    
                if (testBox.intersectsBox(cible.boundingBox)) {
                    console.log("💥 Collision détectée !");
                    
                    // Ajouter des points au score
                    if (cible.userData.points) {
                        this._score.addToScore(cible.userData.points);
                    }
    
                    // // Positionner la flèche à l’impact avec un léger enfoncement
                    // let impactDirection = arrow.velocity.clone().normalize();
                    // let penetrationDepth = Math.min(arrow.velocity.length() * 0.2, _arrows.arrowModel.longueur * 0.3);
                    // let impactPoint = interpolatedPosition.clone().addScaledVector(impactDirection, penetrationDepth);
                    
                    // arrow.mesh.position.copy(impactPoint);
                    arrow.velocity.set(0, 0, 0);
                    arrow.stopped = true;
                    return;
                }
            }
        });
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
    
                arrow.mesh.position.add(arrow.velocity);
    
                // **Faire tourner la flèche selon sa trajectoire**
                arrow.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrow.velocity.clone().normalize());
    
    
                this.checkCollision(arrow);
                this.checkGroundCollision(arrow);
            }
            // **Faire face au joueur**
            // if (arrow.speedText) {
            //     let cameraPosition = _arrows._scene.camera.position.clone();
            //     arrow.speedText.lookAt(cameraPosition);
            
            //     // **Vérifier que la rotation X et Z restent bien fixes**
            //     arrow.speedText.rotation.x = 0;
            //     arrow.speedText.rotation.z = 0;
            // }
            
        });
    },
    
};

export { _arrows };
