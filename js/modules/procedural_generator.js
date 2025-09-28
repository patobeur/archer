const _proceduralGenerator = {
    generateNatureObjects: function() {
        console.log('[procedural_generator.js] Generating nature objects procedurally...');
        const natureObjects = [];

        const models = [
            'BigTreeWithLeaves',
            'SmallTreeWithLeave',
            'TreeNoLeavesBig',
            'TreeNoLeavesSmall',
            'BigBush',
            'SmallBush'
        ];

        const groveCenters = [
            { x: -100, z: -80, density: 15, radius: 30 },
            { x: 120, z: -150, density: 12, radius: 25 },
            { x: 60, z: 100, density: 18, radius: 35 },
            { x: -170, z: 140, density: 15, radius: 40 },
            { x: 190, z: 20, density: 20, radius: 45 },
            { x: 0, z: -180, density: 10, radius: 30 },
            { x: -150, z: 20, density: 13, radius: 28 },
            { x: 150, z: 150, density: 16, radius: 33 },
        ];

        groveCenters.forEach(grove => {
            for (let i = 0; i < grove.density; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * grove.radius;

                const position = {
                    x: grove.x + distance * Math.cos(angle),
                    y: 0,
                    z: grove.z + distance * Math.sin(angle)
                };

                const rotation = {
                    x: 0,
                    y: Math.random() * 2 * Math.PI,
                    z: 0
                };

                const scaleFactor = 0.9 + Math.random() * 0.4; // Random scale between 0.9 and 1.3
                const scale = {
                    x: scaleFactor,
                    y: scaleFactor + (Math.random() * 0.2 - 0.1), //Slightly different Y scale
                    z: scaleFactor
                };

                const name = models[Math.floor(Math.random() * models.length)];

                natureObjects.push({ name, position, rotation, scale });
            }
        });

        console.log(`[procedural_generator.js] Generated ${natureObjects.length} objects.`);
        return natureObjects;
    }
};

export { _proceduralGenerator };