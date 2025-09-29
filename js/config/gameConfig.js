const config = {
	// 'json' pour charger depuis le fichier nature_positions.json
	// 'procedural' pour générer le monde à la volée
	population_mode: "procedural",
	// 'forest' pour charger la forêt
	// 'default' pour utiliser le `population_mode`
	environment: "forest",
	bows: {
        léger: {
            power: 1.2,
            materiau: "Bois d'if",
            description: "Un arc simple et léger, parfait pour les débutants."
        },
        moyen: {
            power: 1.5,
            materiau: "Bois et corne",
            description: "Un arc composite offrant un bon compromis entre vitesse et puissance."
        },
        fort: {
            power: 2,
            materiau: "Fibre de carbone",
            description: "Un arc moderne et puissant pour les archers expérimentés."
        }
    }
};

export { config };