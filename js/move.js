import * as THREE from 'three';
const _move = {
    moveSpeed: 0.1, // Vitesse de déplacement
    keys: { z: false, q: false, s: false, d: false },
    _scene:undefined,
    init: function (_scene){
        this._scene = _scene
        this.addListener()
    },
    addListener: function (){
        document.addEventListener('keydown', (event) => {
            this.keys[event.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });
    },
    updatePlayerMovement: function () {
        let direction = new THREE.Vector3();
        this._scene.camera.getWorldDirection(direction);
        // direction.y = 0; // Supprime le mouvement vertical (évite de voler)
    
        let right = new THREE.Vector3();
        right.crossVectors(this._scene.camera.up, direction).normalize(); // Calcul du vecteur latéral
    
        if (this.keys.z) this._scene.camera.position.addScaledVector(direction, this.moveSpeed);
        if (this.keys.s) this._scene.camera.position.addScaledVector(direction, -this.moveSpeed);
        if (this.keys.q) this._scene.camera.position.addScaledVector(right, this.moveSpeed);
        if (this.keys.d) this._scene.camera.position.addScaledVector(right, -this.moveSpeed);
    }
}
export { _move }
