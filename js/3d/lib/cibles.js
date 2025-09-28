import * as THREE from 'three';
const _cibles = {
    cible:undefined,
    _scene:undefined,
    init:function (_scene) {
        this._scene = _scene
        this.createCible();
    },
    createCible:function () {
        this.cible = new THREE.Group();
        const colors = [0xff9090, 0xffff90, 0x9090ff, 0xffffff];
        const points = [10, 30, 50, 100];
        const size = 5;
        for (let i = 0; i < 4; i++) {
            const discGeometry3 = new THREE.CylinderGeometry(
                1.5 - i * 0.45,
                1.5 - i * 0.45,
                0.1,
                32);
            const discGeometry = new THREE.BoxGeometry(size - i * 1.3, 0.2, size - i * 1.3);
    
            const discMaterial = new THREE.MeshStandardMaterial({ color: colors[i] });
            const disc = new THREE.Mesh(discGeometry, discMaterial);
            disc.position.y = (i * 0.2);
            disc.userData = { points: points[i] };
            disc.castShadow = true
            disc.receiveShadow = true;
            this.cible.add(disc);
        }
        this.cible.position.set(0, 3, -30);
        this.cible.rotation.x = Math.PI / 2;
        this.cible.castShadow = true
        this.cible.receiveShadow = true;
        this._scene.scene.add(this.cible);
    }
}
export {_cibles}