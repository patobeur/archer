import * as THREE from "three";

const _move = {
	moveSpeed: 0.1,
	lookSpeed: 0.003,
	keys: { z: false, q: false, s: false, d: false },
	_scene: undefined,

	// --- Touch Controls State ---
	move_touch: { id: -1, start: { x: 0, y: 0 }, vector: { x: 0, y: 0 } },
	look_touch: { id: -1, start: { x: 0, y: 0 }, vector: { x: 0, y: 0 } },

	// --- Joystick UI Elements ---
	joysticks: {
		move: { base: null, handle: null },
		look: { base: null, handle: null },
	},

	init: function (_scene) {
		this._scene = _scene;
		const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (isTouchDevice) {
			this.createJoysticks();
		}
		this.addListeners();
	},

	createJoysticks: function () {
		const joystickStyles = {
			base: {
				position: "absolute",
				width: "120px",
				height: "120px",
				background: "rgba(128, 128, 128, 0.5)",
				borderRadius: "50%",
				display: "none",
				zIndex: "100",
			},
			handle: {
				position: "absolute",
				width: "60px",
				height: "60px",
				background: "rgba(200, 200, 200, 0.8)",
				borderRadius: "50%",
				display: "none",
				zIndex: "101",
			},
		};

		// Create Move Joystick
		this.joysticks.move.base = document.createElement("div");
		this.joysticks.move.handle = document.createElement("div");
		Object.assign(this.joysticks.move.base.style, joystickStyles.base);
		Object.assign(this.joysticks.move.handle.style, joystickStyles.handle);
		document.body.appendChild(this.joysticks.move.base);
		document.body.appendChild(this.joysticks.move.handle);

		// Create Look Joystick
		this.joysticks.look.base = document.createElement("div");
		this.joysticks.look.handle = document.createElement("div");
		Object.assign(this.joysticks.look.base.style, joystickStyles.base);
		Object.assign(this.joysticks.look.handle.style, joystickStyles.handle);
		document.body.appendChild(this.joysticks.look.base);
		document.body.appendChild(this.joysticks.look.handle);
	},

	addListeners: function () {
		// --- Keyboard (for Desktop) ---
		document.addEventListener("keydown", (e) => (this.keys[e.key.toLowerCase()] = true));
		document.addEventListener("keyup", (e) => (this.keys[e.key.toLowerCase()] = false));

		// --- Touch (for Mobile) ---
		document.addEventListener("touchstart", (e) => {
			e.preventDefault();
			for (let touch of e.changedTouches) {
				if (touch.clientX < window.innerWidth / 2 && this.move_touch.id === -1) {
					// --- Start Move Touch ---
					this.move_touch.id = touch.identifier;
					this.move_touch.start = { x: touch.clientX, y: touch.clientY };
					this.showJoystick("move", this.move_touch.start);
				} else if (touch.clientX >= window.innerWidth / 2 && this.look_touch.id === -1) {
					// --- Start Look Touch ---
					this.look_touch.id = touch.identifier;
					this.look_touch.start = { x: touch.clientX, y: touch.clientY };
					this.showJoystick("look", this.look_touch.start);
				}
			}
		}, { passive: false });

		document.addEventListener("touchmove", (e) => {
			e.preventDefault();
			for (let touch of e.changedTouches) {
				if (touch.identifier === this.move_touch.id) {
					// --- Move Joystick Update ---
					this.updateJoystick("move", touch);
				} else if (touch.identifier === this.look_touch.id) {
					// --- Look Joystick Update ---
					this.updateJoystick("look", touch);
				}
			}
		}, { passive: false });

		document.addEventListener("touchend", (e) => {
			for (let touch of e.changedTouches) {
				if (touch.identifier === this.move_touch.id) {
					// --- End Move Touch ---
					this.resetJoystick("move");
				} else if (touch.identifier === this.look_touch.id) {
					// --- End Look Touch ---
					this.resetJoystick("look");
				}
			}
		});
	},

	// --- Joystick Helper Functions ---
	showJoystick: function (type, startPos) {
		const { base, handle } = this.joysticks[type];
		base.style.display = "block";
		handle.style.display = "block";
		base.style.left = `${startPos.x - 60}px`;
		base.style.top = `${startPos.y - 60}px`;
		handle.style.left = `${startPos.x - 30}px`;
		handle.style.top = `${startPos.y - 30}px`;
	},

	updateJoystick: function (type, touch) {
		const state = this[`${type}_touch`];
		const { handle } = this.joysticks[type];

		state.vector = { x: touch.clientX - state.start.x, y: touch.clientY - state.start.y };
		const angle = Math.atan2(state.vector.y, state.vector.x);
		const distance = Math.min(Math.sqrt(state.vector.x ** 2 + state.vector.y ** 2), 60);

		handle.style.left = `${state.start.x + Math.cos(angle) * distance - 30}px`;
		handle.style.top = `${state.start.y + Math.sin(angle) * distance - 30}px`;
	},

	resetJoystick: function (type) {
		const state = this[`${type}_touch`];
		const { base, handle } = this.joysticks[type];

		state.id = -1;
		state.vector = { x: 0, y: 0 };
		base.style.display = "none";
		handle.style.display = "none";
	},

	// --- Player Update Functions ---
	updatePlayerMovement: function () {
		// Update keys based on move joystick
		const threshold = 20;
		this.keys.z = this.move_touch.vector.y < -threshold;
		this.keys.s = this.move_touch.vector.y > threshold;
		this.keys.q = this.move_touch.vector.x < -threshold;
		this.keys.d = this.move_touch.vector.x > threshold;

		// Apply movement
		const direction = new THREE.Vector3();
		this._scene.camera.getWorldDirection(direction);
		const right = new THREE.Vector3().crossVectors(this._scene.camera.up, direction).normalize();

		if (this.keys.z) this._scene.camera.position.addScaledVector(direction, this.moveSpeed);
		if (this.keys.s) this._scene.camera.position.addScaledVector(direction, -this.moveSpeed);
		if (this.keys.q) this._scene.camera.position.addScaledVector(right, this.moveSpeed);
		if (this.keys.d) this._scene.camera.position.addScaledVector(right, -this.moveSpeed);
	},

	updateCameraRotation: function () {
		if (this.look_touch.id === -1) return;

		const euler = new THREE.Euler(0, 0, 0, 'YXZ');
		euler.setFromQuaternion(this._scene.camera.quaternion);

		euler.y -= this.look_touch.vector.x * this.lookSpeed;
		euler.x -= this.look_touch.vector.y * this.lookSpeed;

		// Clamp vertical rotation
		euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

		this._scene.camera.quaternion.setFromEuler(euler);

		// Reset vector to prevent continuous rotation after finger stops moving
		this.look_touch.vector = { x: 0, y: 0 };
	},
};

export { _move };