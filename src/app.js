import * as Three from "../vendor/threejs/build/three.module.js";
import {OrbitControls} from "../vendor/threejs/examples/jsm/controls/OrbitControls.js";
import {Loader, Models} from "./loader.js";

const obj = {};

const scene = {
    initialize: (destination = document.body, fullscreen = true) => {
        obj.container = document.createElement("div");
        destination.appendChild(obj.container);

        if (fullscreen) {
            obj.container.classList.add("fullscreen");
        }

        obj.scene = new Three.Scene();
        obj.scene.background = new Three.Color(0xA0A0A0);

        obj.renderer = new Three.WebGLRenderer({antialias: true});
        obj.renderer.setPixelRatio(window.devicePixelRatio);
        obj.renderer.setSize(window.innerWidth, window.innerHeight);
        obj.renderer.shadowMap.enabled = true;
        obj.renderer.shadowMap.soft = true;
        obj.renderer.shadowMap.type = Three.PCFSoftShadowMap;
        obj.container.appendChild(obj.renderer.domElement);

        obj.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);

        obj.sun = new Three.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1);
        obj.sun.position.set(100, 10, 100);
        obj.scene.add(obj.sun);

        obj.controls = new OrbitControls(obj.camera, obj.renderer.domElement);
        //obj.controls.minDistance = 50;
        //obj.controls.maxDistance = 80;
        //obj.controls.minPolarAngle = Math.PI / 4;
        //obj.controls.maxPolarAngle = Math.PI / 2 - Math.PI / 24;
        //obj.controls.minAzimuthAngle = Math.PI / 4 - Math.PI / 12;
        //obj.controls.maxAzimuthAngle = Math.PI / 4 + Math.PI / 12;
        obj.controls.target.set(obj.scene.position.x, obj.scene.position.y, obj.scene.position.z);
        obj.controls.update();
    },

    animate: () => {
        scene.render();
        requestAnimationFrame(scene.animate);
    },

    render: () => {
        obj.renderer.render(obj.scene, obj.camera);
    },

    onWindowResize: () => {
        obj.camera.aspect = window.innerWidth / window.innerHeight;
        obj.camera.updateProjectionMatrix();

        obj.renderer.setSize(window.innerWidth, window.innerHeight);
    },
};

window.onresize = scene.onWindowResize;

scene.initialize();
scene.animate();
