import * as Three from "../vendor/threejs/build/three.module.js";
import Stats from "../vendor/stats.js";
import {OrbitControls} from "../vendor/threejs/examples/jsm/controls/OrbitControls.js";
import Planet from "./planet.js";

const obj = {};

const scene = {
    initialize: (destination = document.body, fullscreen = true) => {
        obj.container = document.createElement("div");
        destination.appendChild(obj.container);

        obj.stats = new Stats();
        document.body.appendChild(obj.stats.dom);

        if (fullscreen) {
            obj.container.classList.add("fullscreen");
        }

        obj.scene = new Three.Scene();
        obj.scene.background = new Three.Color(0x111111);

        obj.renderer = new Three.WebGLRenderer({antialias: true});
        obj.renderer.setPixelRatio(window.devicePixelRatio);
        obj.renderer.setSize(window.innerWidth, window.innerHeight);
        obj.renderer.shadowMap.enabled = true;
        obj.renderer.shadowMap.soft = true;
        obj.renderer.shadowMap.type = Three.PCFSoftShadowMap;
        obj.container.appendChild(obj.renderer.domElement);

        obj.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
        obj.camera.position.set(-1000, 100, 200);

        obj.ambiant = new Three.AmbientLight(0xFFFFFF, 0.3);
        obj.scene.add(obj.ambiant);

        obj.sun = new Three.Mesh(new Three.SphereGeometry(100, 20, 20), new Three.MeshPhongMaterial({color: 0xF7DC6F}));
        obj.sun.castShadow = true;
        obj.sun.receiveShadow = true;
        for (let vertex of obj.sun.geometry.vertices) {
            vertex.ox = vertex.x;
            vertex.oy = vertex.y;
            vertex.oz = vertex.z;
        }
        obj.scene.add(obj.sun);

        let sun_light_points = new Three.SphereGeometry(150, 8, 4);

        for (let vertex of sun_light_points.vertices) {
            let light = new Three.SpotLight(0xFFFFFF, 1.5, 200, 1);
            light.position.set(vertex.x, vertex.y, vertex.z);
            obj.scene.add(light);
        }

        obj.sun_light = new Three.PointLight(0xFFFFFF, 1);
        obj.scene.add(obj.sun_light);

        obj.earth = Planet.create("earth", {
            color: 0x4287F5,
            size: 20,
            sharpness: 5,
            orbit: {
                x: 350,
                y: 50,
                z: 350
            }
        }).on(obj.scene);

        obj.moon = Planet.create("moon", {
            color: 0xFFFFFF,
            size: 5,
            sharpness: 0,
            orbit: {
                x: 50,
                y: 50,
                z: 50,
            },
            velocity: {
                orbit: 10
            }
        }).on(obj.earth);

        obj.mars = Planet.create("mars", {
            color: 0x733D36,
            size: 15,
            sharpness: 2,
            orbit: {
                x: 500,
                y: 300,
                z: 600
            },
            velocity: {
                orbit: 2
            }
        }).on(obj.scene);

        obj.controls = new OrbitControls(obj.camera, obj.renderer.domElement);
        obj.controls.target.set(obj.scene.position.x, obj.scene.position.y, obj.scene.position.z);
        obj.controls.update();

        document.getElementById("loading").remove();
    },

    animate: () => {
        for (let vertex of obj.sun.geometry.vertices) {
            vertex.x = within(vertex.x + (Math.random() - 0.5) * 2, vertex.ox, 5);
            vertex.y = within(vertex.y + (Math.random() - 0.5) * 2, vertex.oy, 5);
            vertex.z = within(vertex.z + (Math.random() - 0.5) * 2, vertex.oz, 5);
        }

        let time = Date.now() * 0.0005;
        obj.earth.update(time);
        obj.moon.update(time);
        obj.mars.update(time);

        obj.sun.geometry.verticesNeedUpdate = true;

        scene.render();
        obj.stats.update();
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

function within(val, base, variation) {
    if (val > base + variation) {
        return base + variation;
    } else if (val < base - variation) {
        return base - variation;
    }

    return val;
}

window.onresize = scene.onWindowResize;

scene.initialize();
scene.animate();
