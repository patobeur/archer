import * as THREE from "three";
const _move = {
	moveSpeed: 0.1, // Vitesse de déplacement
	keys: { z: false, q: false, s: false, d: false },
	_scene: undefined,
	touch_start: { x: 0, y: 0 }, // Pour le contrôle tactile
	touch_vector: { x: 0, y: 0 }, // Vecteur de mouvement tactile
	joystick_base: null,
	joystick_handle: null,

	init: function (_scene) {
		this._scene = _scene;
		this.createJoystick();
		this.addListener();
	},

	createJoystick: function () {
		this.joystick_base = document.createElement("div");
		this.joystick_handle = document.createElement("div");

		Object.assign(this.joystick_base.style, {
			position: "absolute",
			width: "120px",
			height: "120px",
			background: "rgba(128, 128, 128, 0.5)",
			borderRadius: "50%",
			display: "none", // Caché par défaut
			zIndex: "100",
		});

		Object.assign(this.joystick_handle.style, {
			position: "absolute",
			width: "60px",
			height: "60px",
			background: "rgba(200, 200, 200, 0.8)",
			borderRadius: "50%",
			display: "none", // Caché par défaut
			zIndex: "101",
		});

		document.body.appendChild(this.joystick_base);
		document.body.appendChild(this.joystick_handle);
	},

	addListener: function () {
		// Clavier
		document.addEventListener("keydown", (event) => {
			this.keys[event.key.toLowerCase()] = true;
		});

		document.addEventListener("keyup", (event) => {
			this.keys[event.key.toLowerCase()] = false;
		});

		// Tactile
		document.addEventListener(
			"touchstart",
			(event) => {
				// Uniquement sur la moitié gauche de l'écran
				if (event.touches[0].clientX < window.innerWidth / 2) {
					event.preventDefault();
					this.touch_start.x = event.touches[0].clientX;
					this.touch_start.y = event.touches[0].clientY;

					// Affiche et centre le joystick
					this.joystick_base.style.display = "block";
					this.joystick_handle.style.display = "block";
					this.joystick_base.style.left = `${this.touch_start.x - 60}px`;
					this.joystick_base.style.top = `${this.touch_start.y - 60}px`;
					this.joystick_handle.style.left = `${this.touch_start.x - 30}px`;
					this.joystick_handle.style.top = `${this.touch_start.y - 30}px`;
				}
			},
			{ passive: false }
		);

		document.addEventListener(
			"touchmove",
			(event) => {
				// Si le toucher a commencé à gauche
				if (this.touch_start.x !== 0) {
					event.preventDefault();
					const current_x = event.touches[0].clientX;
					const current_y = event.touches[0].clientY;

					this.touch_vector.x = current_x - this.touch_start.x;
					this.touch_vector.y = current_y - this.touch_start.y;

					// Limite le mouvement du handle à l'intérieur de la base
					const angle = Math.atan2(this.touch_vector.y, this.touch_vector.x);
					const distance = Math.min(
						Math.sqrt(this.touch_vector.x ** 2 + this.touch_vector.y ** 2),
						60
					); // 60 = rayon de la base
					const handle_x =
						this.touch_start.x + Math.cos(angle) * distance - 30;
					const handle_y =
						this.touch_start.y + Math.sin(angle) * distance - 30;

					this.joystick_handle.style.left = `${handle_x}px`;
					this.joystick_handle.style.top = `${handle_y}px`;

					const threshold = 20; // Seuil pour éviter les mouvements involontaires

					// Simuler les touches
					this.keys.z = this.touch_vector.y < -threshold;
					this.keys.s = this.touch_vector.y > threshold;
					this.keys.q = this.touch_vector.x < -threshold;
					this.keys.d = this.touch_vector.x > threshold;
				}
			},
			{ passive: false }
		);

		document.addEventListener("touchend", () => {
			// Réinitialiser si le toucher a commencé
			if (this.touch_start.x !== 0) {
				this.keys = { z: false, q: false, s: false, d: false };
				this.touch_start = { x: 0, y: 0 };
				this.touch_vector = { x: 0, y: 0 };
				this.joystick_base.style.display = "none";
				this.joystick_handle.style.display = "none";
			}
		});
	},
	updatePlayerMovement: function () {
		let direction = new THREE.Vector3();
		this._scene.camera.getWorldDirection(direction);
		// direction.y = 0; // Supprime le mouvement vertical (évite de voler)

		let right = new THREE.Vector3();
		right.crossVectors(this._scene.camera.up, direction).normalize(); // Calcul du vecteur latéral

		if (this.keys.z)
			this._scene.camera.position.addScaledVector(direction, this.moveSpeed);
		if (this.keys.s)
			this._scene.camera.position.addScaledVector(direction, -this.moveSpeed);
		if (this.keys.q)
			this._scene.camera.position.addScaledVector(right, this.moveSpeed);
		if (this.keys.d)
			this._scene.camera.position.addScaledVector(right, -this.moveSpeed);
	},
};
export { _move };