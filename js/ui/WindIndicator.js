import * as THREE from 'three';
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
export { WindArrow}