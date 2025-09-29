import * as THREE from "three";
import { _uiManager } from "../ui/UIManager.js";

const _move = {
    app: null,
    _scene: undefined,
    moveSpeed: 0.1,
    lookSpeed: 0.004,
    keys: { z: false, q: false, s: false, d: false },

    // --- Touch Controls State ---
    move_touch: { id: -1, start: { x: 0, y: 0 }, vector: { x: 0, y: 0 } },
    look_touch: { id: -1, last: { x: 0, y: 0 }, vector: { x: 0, y: 0 } },

    // --- Mouse Controls State ---
    isMouseDown: false,
    lastMouseX: 0,
    lastMouseY: 0,

    // --- Joystick UI ---
    joystick_move: { base: null, handle: null },

    init: function (app, _scene) {
        this.app = app;
        this._scene = _scene;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            this.createJoystick();
        }
        this.addListeners();
    },

    update: function() {
        this.updatePlayerMovement();
        this.updateCameraRotation();
        this.checkPlayerPosition();
        this.handleCameraRecenter();
    },

    checkPlayerPosition: function() {
        const playerPosition = this._scene.camera.position;
        const zone = this._scene.playerAllowedZone;
        const distance = Math.sqrt(
            Math.pow(playerPosition.x - zone.position.x, 2) +
            Math.pow(playerPosition.z - zone.position.z, 2)
        );

        if (distance > zone.radius) {
            this.app.isPlayerOutOfBounds = true;
            if (_uiManager.warningMessage) _uiManager.warningMessage.style.display = 'block';
        } else {
            this.app.isPlayerOutOfBounds = false;
            if (_uiManager.warningMessage) _uiManager.warningMessage.style.display = 'none';
        }
    },

    handleCameraRecenter: function() {
        if (!this.app.recenterCamera) return;

        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        euler.setFromQuaternion(this._scene.camera.quaternion);
        euler.x = THREE.MathUtils.lerp(euler.x, 0, 0.1);

        if (Math.abs(euler.x) < 0.001) {
            euler.x = 0;
            this.app.recenterCamera = false;
        }

        this._scene.camera.quaternion.setFromEuler(euler);
    },

    createJoystick: function () {
        this.joystick_move.base = document.createElement("div");
        this.joystick_move.handle = document.createElement("div");

        Object.assign(this.joystick_move.base.style, {
            position: "absolute",
            width: "120px",
            height: "120px",
            background: "rgba(128, 128, 128, 0.3)",
            borderRadius: "50%",
            display: "none",
            zIndex: "100",
            transition: "opacity 0.2s",
        });

        Object.assign(this.joystick_move.handle.style, {
            position: "absolute",
            width: "60px",
            height: "60px",
            background: "rgba(200, 200, 200, 0.6)",
            borderRadius: "50%",
            display: "none",
            zIndex: "101",
        });

        document.body.appendChild(this.joystick_move.base);
        document.body.appendChild(this.joystick_move.handle);
    },

    addListeners: function () {
        document.addEventListener("keydown", (e) => (this.keys[e.key.toLowerCase()] = true));
        document.addEventListener("keyup", (e) => (this.keys[e.key.toLowerCase()] = false));

        document.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isMouseDown) return;

            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;

            const euler = new THREE.Euler(0, 0, 0, 'YXZ');
            euler.setFromQuaternion(this._scene.camera.quaternion);

            euler.y -= deltaX * this.lookSpeed;
            euler.x -= deltaY * this.lookSpeed;
            euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

            this._scene.camera.quaternion.setFromEuler(euler);
        });

        document.addEventListener("touchstart", (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                if (touch.clientX < window.innerWidth / 2 && this.move_touch.id === -1) {
                    this.move_touch.id = touch.identifier;
                    this.move_touch.start = { x: touch.clientX, y: touch.clientY };
                    this.showJoystick(this.move_touch.start);
                } else if (touch.clientX >= window.innerWidth / 2 && this.look_touch.id === -1) {
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
        base.style.opacity = '0.3';
        handle.style.opacity = '0.3';
    },

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
        if (this.app.recenterCamera || this.look_touch.id === -1 || (this.look_touch.vector.x === 0 && this.look_touch.vector.y === 0)) return;

        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        euler.setFromQuaternion(this._scene.camera.quaternion);

        euler.y -= this.look_touch.vector.x * this.lookSpeed;
        euler.x -= this.look_touch.vector.y * this.lookSpeed;
        euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

        this._scene.camera.quaternion.setFromEuler(euler);
        this.look_touch.vector = { x: 0, y: 0 };
    },
};

export { _move };