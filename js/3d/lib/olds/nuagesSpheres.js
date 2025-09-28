import * as THREE from 'three';

let createNuages2 = {
    clouds: [],
    scene: null,
    numClouds: 10,

    // Initialisation des nuages avec un effet plus réaliste
    init: function(scene, numClouds = 10) {
        this.scene = scene.scene;
        this.numClouds = numClouds;
        this.clouds = [];

        // Ajouter un effet de brouillard pour plus de réalisme
        scene.fog = new THREE.FogExp2(0xcce0ff, 0.002);

        // Générer les nuages
        for (let i = 0; i < this.numClouds; i++) {
            let cloud = this.createCloud();
            if (cloud) {
                this.scene.add(cloud);
                this.clouds.push(cloud);
            }
        }
    },

    // Création d'un nuage avec un effet plus naturel
    createCloud: function() {
        if (!this.scene) {
            console.error("La scène n'a pas été initialisée !");
            return null;
        }

        const cloud = new THREE.Group();
        const geometry = new THREE.SphereGeometry(10, 16, 16);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            roughness: 0.5,
            transmission: 0.6, // Effet légèrement translucide
        });

        const numSpheres = 5 + Math.floor(Math.random() * 8); // Plus de variations
        for (let i = 0; i < numSpheres; i++) {
            const sphere = new THREE.Mesh(geometry, material);
            
            // Déformation pour éviter un aspect trop "rond"
            const scaleX = 1.0 + Math.random() * 0.3;
            const scaleY = 0.8 + Math.random() * 0.5;
            const scaleZ = 1.2 + Math.random() * 0.3;
            sphere.scale.set(scaleX, scaleY, scaleZ);

            sphere.position.set(
                Math.random() * 30 - 15,
                Math.random() * 8 - 4,
                Math.random() * 10 - 5
            );
            
            cloud.add(sphere);
        }

        cloud.position.set(
            Math.random() * 200 - 100,
            Math.random() * 50 + 20,
            Math.random() * 200 - 100
        );

        return cloud;
    },

    // Animation améliorée des nuages
    update: function() {
        this.clouds.forEach(cloud => {
            cloud.position.x += 0.02 + Math.random() * 0.02; // Vitesse variable
            cloud.position.y += Math.sin(cloud.position.x * 0.01) * 0.02; // Léger effet de flottement

            if (cloud.position.x > 100) cloud.position.x = -100;
        });
    }
};

export { createNuages2 };
