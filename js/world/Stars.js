import * as THREE from 'three';

function _createStars(scene, count = 1000, spread = 300, minDistance = 200) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        // Distance aléatoire entre minDistance et spread/2
        const distance = minDistance + Math.random() * (spread / 2 - minDistance);

        // Génération d'un point dans une direction aléatoire
        const theta = Math.random() * Math.PI * 2; // Angle autour de l'axe Y
        const phi = Math.acos(2 * Math.random() - 1); // Angle de hauteur

        // Conversion en coordonnées cartésiennes
        const x = distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.sin(phi) * Math.sin(theta);
        const z = distance * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Taille aléatoire (petite ou moyenne)
        sizes[i] = Math.random() * 200 + 0.5; // Taille entre 0.5 et 2.5
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Material pour les étoiles 
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        sizeAttenuation: true,
        // transparent: true,
        // emissive: 0xffffff 
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

export { _createStars };
