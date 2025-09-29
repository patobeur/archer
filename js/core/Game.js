import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

import { _scene } from './Scene.js';
import { _move } from '../game/PlayerMovement.js';
import { _arrows } from '../game/Arrows.js';

const _game = {
    stats: new Stats(),
    clock: new THREE.Clock(),
    delta: 0,
    app: null,

    init: function(app) {
        this.app = app;
        document.body.appendChild(this.stats.dom);
        this.stats.dom.style.top = 'initial';
        this.stats.dom.style.bottom = '0';
    },

    start: function() {
        this.animate();
    },

    animate: function() {
        requestAnimationFrame(this.animate.bind(this));

        this.delta = this.clock.getDelta();

        // Centralized player update
        _move.update();

        // Update wind for arrows
        if (this.app.createClouds) {
            const windDirection = this.app.createClouds.getWindDirection();
            const windSpeed = this.app.createClouds.getWindSpeed();
            _arrows.wind.copy(windDirection).multiplyScalar(windSpeed);
        }

        _arrows.checkArrows();
        _scene.renderer.render(_scene.scene, _scene.camera);
        this.stats.update();

        if (this.app.createClouds) {
            this.app.createClouds.update();
        }
    }
};

export { _game };