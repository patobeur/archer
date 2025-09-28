import * as THREE from "three";

const _move = {
	moveSpeed: 0.1,
	lookSpeed: 0.004, // Sensibilité de la visée
	keys: { z: false, q: false, s: false, d: false },
	_scene: undefined,

	// --- Touch Controls State ---
	move_touch: { id: -1, start: { x: 0, y: 0 }, vector: { x: 0, y: 0 } },
	look_touch: { id: -1, last: { x: 0, y: 0 }, vector: { x: 0, y: 0 } },

	// --- Joystick UI ---
	joystick_move: { base: null, handle: null },

	init: function (_scene) {
		this._scene = _scene;
		const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (isTouchDevice) {
			this.createJoystick();
		}
		this.addListeners();
	},

	createJoystick: function () {
		this.joystick_move.base = document.createElement("div");
		this.joystick_move.handle = document.createElement("div");

		Object.assign(this.joystick_move.base.style, {
			position: "absolute",
			width: "120px",
			height: "120px",
			background: "rgba(128, 128, 128, 0.3)", // Plus transparent
			borderRadius: "50%",
			display: "none",
			zIndex: "100",
			transition: "opacity 0.2s",
		});

		Object.assign(this.joystick_move.handle.style, {
			position: "absolute",
			width: "60px",
			height: "60px",
			background: "rgba(200, 200, 200, 0.6)", // Plus transparent
			borderRadius: "50%",
			display: "none",
			zIndex: "101",
		});

		document.body.appendChild(this.joystick_move.base);
		document.body.appendChild(this.joystick_move.handle);
	},

	addListeners: function () {
		// Keyboard (Desktop)
		document.addEventListener("keydown", (e) => (this.keys[e.key.toLowerCase()] = true));
		document.addEventListener("keyup", (e) => (this.keys[e.key.toLowerCase()] = false));

		// Touch (Mobile)
		document.addEventListener("touchstart", (e) => {
			e.preventDefault();
			for (let touch of e.changedTouches) {
				if (touch.clientX < window.innerWidth / 2 && this.move_touch.id === -1) {
					// Start Move Touch
					this.move_touch.id = touch.identifier;
					this.move_touch.start = { x: touch.clientX, y: touch.clientY };
					this.showJoystick(this.move_touch.start);
				} else if (touch.clientX >= window.innerWidth / 2 && this.look_touch.id === -1) {
					// Start Look Touch
					this.look_touch.id = touch.identifier;
					this.look_touch.last = { x: touch.clientX, y: touch.clientY };
				}
			}
		}, { passive: false });

		document.addEventListener("touchmove", (e) => {
			e.preventDefault();
			for (let touch of e.changedTouches) {
				if (touch.identifier === this.move_touch.id) {
					this.updateJoystick(touch);
				} else if (touch.identifier === this.look_touch.id) {
					// Calculate delta for rotation
					const deltaX = touch.clientX - this.look_touch.last.x;
					const deltaY = touch.clientY - this.look_touch.last.y;
					this.look_touch.vector = { x: deltaX, y: deltaY };
					this.look_touch.last = { x: touch.clientX, y: touch.clientY };
				}
			}
		}, { passive: false });

		document.addEventListener("touchend", (e) => {
			for (let touch of e.changedTouches) {
				if (touch.identifier === this.move_touch.id) {
					this.resetJoystick();
				} else if (touch.identifier === this.look_touch.id) {
					this.look_touch.id = -1;
					this.look_touch.vector = { x: 0, y: 0 };
				}
			}
		});
	},

	// --- Joystick Helpers ---
	showJoystick: function (pos) {
		const { base, handle } = this.joystick_move;
		base.style.display = "block";
		handle.style.display = "block";
		base.style.opacity = '1';
		handle.style.opacity = '1';
		base.style.left = `${pos.x - 60}px`;
		base.style.top = `${pos.y - 60}px`;
		handle.style.left = `${pos.x - 30}px`;
		handle.style.top = `${pos.y - 30}px`;
	},

	updateJoystick: function (touch) {
		const { start } = this.move_touch;
		const { handle } = this.joystick_move;

		this.move_touch.vector = { x: touch.clientX - start.x, y: touch.clientY - start.y };
		const angle = Math.atan2(this.move_touch.vector.y, this.move_touch.vector.x);
		const distance = Math.min(Math.sqrt(this.move_touch.vector.x ** 2 + this.move_touch.vector.y ** 2), 60);

		handle.style.left = `${start.x + Math.cos(angle) * distance - 30}px`;
		handle.style.top = `${start.y + Math.sin(angle) * distance - 30}px`;
	},

	resetJoystick: function () {
		const { base, handle } = this.joystick_move;
		this.move_touch.id = -1;
		this.move_touch.vector = { x: 0, y: 0 };

		// Fade out instead of hiding
		base.style.opacity = '0.3';
		handle.style.opacity = '0.3';
	},

	// --- Player Update Functions ---
	updatePlayerMovement: function () {
		const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (isTouchDevice) {
			const threshold = 20;
			this.keys.z = this.move_touch.vector.y < -threshold;
			this.keys.s = this.move_touch.vector.y > threshold;
			this.keys.q = this.move_touch.vector.x < -threshold;
			this.keys.d = this.move_touch.vector.x > threshold;
		}

		if (this.keys.z || this.keys.s || this.keys.q || this.keys.d) {
			const direction = new THREE.Vector3();
			this._scene.camera.getWorldDirection(direction);
			const right = new THREE.Vector3().crossVectors(this._scene.camera.up, direction).normalize();

			if (this.keys.z) this._scene.camera.position.addScaledVector(direction, this.moveSpeed);
			if (this.keys.s) this._scene.camera.position.addScaledVector(direction, -this.moveSpeed);
			if (this.keys.q) this._scene.camera.position.addScaledVector(right, this.moveSpeed);
			if (this.keys.d) this._scene.camera.position.addScaledVector(right, -this.moveSpeed);
		}
	},

	updateCameraRotation: function () {
		if (this.look_touch.id === -1 || (this.look_touch.vector.x === 0 && this.look_touch.vector.y === 0)) return;

		const euler = new THREE.Euler(0, 0, 0, 'YXZ');
		euler.setFromQuaternion(this._scene.camera.quaternion);

		euler.y -= this.look_touch.vector.x * this.lookSpeed;
		euler.x -= this.look_touch.vector.y * this.lookSpeed;
		euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

		this._scene.camera.quaternion.setFromEuler(euler);

		// Reset vector to prevent continuous rotation
		this.look_touch.vector = { x: 0, y: 0 };
	},
};

export { _move };