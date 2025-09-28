const config = {
	// 'json' pour charger depuis le fichier nature_positions.json
	// 'procedural' pour générer le monde à la volée
	population_mode: "procedural",
	// 'forest' pour charger la forêt
	// 'default' pour utiliser le `population_mode`
	environment: "forest",
	bows: {
        léger: {
            power: 1.2
        },
        moyen: {
            power: 1.5
        },
        fort: {
            power: 2
        }
    }
};

export { config };