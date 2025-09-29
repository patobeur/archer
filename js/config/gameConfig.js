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
            description: "Fabriqué à partir d'un bois d'if souple, cet arc est le compagnon idéal pour tout archer novice. Sa faible tension permet de se concentrer sur la forme et la précision sans effort excessif. Bien qu'il ne soit pas le plus puissant, sa fiabilité en fait un excellent choix pour l'entraînement et le tir sur cible à courte distance."
        },
        moyen: {
            power: 1.5,
            materiau: "Composite (Bois et Corne)",
            description: "Un chef-d'œuvre d'artisanat, cet arc composite combine la flexibilité du bois avec la résilience de la corne. Il offre un équilibre parfait entre une vitesse de flèche élevée et une puissance de traction gérable. Polyvalent, il est efficace dans diverses situations, de la compétition au tir récréatif."
        },
        fort: {
            power: 2,
            materiau: "Fibre de Carbone",
            description: "Conçu pour la performance maximale, cet arc moderne en fibre de carbone est une merveille d'ingénierie. Sa construction high-tech lui confère une puissance de pénétration et une vitesse de flèche inégalées. Il est réservé aux archers expérimentés capables de maîtriser sa force redoutable pour des tirs précis à longue distance."
        }
    }
};

export { config };