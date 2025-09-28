export const arrows_datas = [
	{
		nom: "Flèche bois simple",
		materiau: "Bois (frêne)",
		pointe: "Pointe fer conique",
		longueur_cm: 75,
		poids_gr: 30,
		vitesse_ms: 50,
		precision: 5,
		degats: 5,
		penetration: 4,
		durabilite: 3,
		prix_euros: 2,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche médiévale de guerre",
		materiau: "Bois (frêne)",
		pointe: "Bodkin (anti-armure)",
		longueur_cm: 80,
		poids_gr: 40,
		vitesse_ms: 45,
		precision: 4,
		degats: 7,
		penetration: 8,
		durabilite: 4,
		prix_euros: 4,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche de chasse traditionnelle",
		materiau: "Bois (cèdre)",
		pointe: "Broadhead (lame large)",
		longueur_cm: 76,
		poids_gr: 35,
		vitesse_ms: 48,
		precision: 6,
		degats: 9,
		penetration: 6,
		durabilite: 4,
		prix_euros: 6,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche alu cible",
		materiau: "Aluminium 7075",
		pointe: "Pointe cible 100 gr",
		longueur_cm: 75,
		poids_gr: 28,
		vitesse_ms: 55,
		precision: 8,
		degats: 4,
		penetration: 3,
		durabilite: 5,
		prix_euros: 7,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche carbone légère",
		materiau: "Carbone pur",
		pointe: "Pointe cible 80 gr",
		longueur_cm: 74,
		poids_gr: 25,
		vitesse_ms: 60,
		precision: 9,
		degats: 5,
		penetration: 4,
		durabilite: 7,
		prix_euros: 10,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche carbone lourde",
		materiau: "Carbone",
		pointe: "Broadhead chasse",
		longueur_cm: 78,
		poids_gr: 40,
		vitesse_ms: 47,
		precision: 7,
		degats: 8,
		penetration: 9,
		durabilite: 8,
		prix_euros: 12,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche hybride alu/carbone",
		materiau: "Alu/carbone",
		pointe: "Pointe 100 gr",
		longueur_cm: 75,
		poids_gr: 30,
		vitesse_ms: 58,
		precision: 9,
		degats: 6,
		penetration: 7,
		durabilite: 8,
		prix_euros: 15,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche de reconstitution viking",
		materiau: "Bois (pin)",
		pointe: "Pointe forgée large",
		longueur_cm: 82,
		poids_gr: 42,
		vitesse_ms: 43,
		precision: 4,
		degats: 8,
		penetration: 7,
		durabilite: 4,
		prix_euros: 5,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche japonaise Yajiri",
		materiau: "Bambou",
		pointe: "Pointe ogive",
		longueur_cm: 90,
		poids_gr: 32,
		vitesse_ms: 52,
		precision: 6,
		degats: 7,
		penetration: 6,
		durabilite: 5,
		prix_euros: 8,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
	{
		nom: "Flèche d’entraînement mousse",
		materiau: "Carbone",
		pointe: "Pointe mousse",
		longueur_cm: 75,
		poids_gr: 22,
		vitesse_ms: 58,
		precision: 7,
		degats: 1,
		penetration: 1,
		durabilite: 6,
		prix_euros: 3,
		bonus: { windResist: 0.003, gravityResist: 0.0003, windImpactRatio: 0.4 },
		userData: {
			dt: 0.2, // Temps simulé par frame (~60 FPS)
			friction: 0.002, // Diminue la friction pour éviter l'arrêt immédiat
			mass: 0.08, // Masse fictive
			gravityScale: 1, // Réduction de l'effet de la gravité
		},
	},
];
