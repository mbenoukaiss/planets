import * as Three from "../vendor/threejs/build/three.module.js";
import {OrbitControls} from "../vendor/threejs/examples/jsm/controls/OrbitControls.js";
import {Planet, Layer, Ring} from "./planet.js";
import {ToggleButton} from "./button.js";
import {within, random_vector} from "./utils.js";

const obj = {};

const scene = {
    initialize: (destination = document.body, fullscreen = true) => {
        obj.container = document.createElement("div");
        destination.appendChild(obj.container);

        obj.follow_earth = new ToggleButton("Follow earth", obj.container, 20, 10)
        obj.follow_earth.onactivation = () => obj.earth.mesh.add(obj.camera);
        obj.follow_earth.ondeactivation = () => obj.earth.mesh.remove(obj.camera);

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

        scene.initialize_sun();
        scene.initialize_stars();

        obj.mercury = Planet.create("mercury", {
            layers: [
                Layer.create({
                    color: 0xA69188,
                    size: 7.5,
                    sharpness: 1,
                })
            ],
            orbit: {
                x: 200,
                y: 50,
                z: 200
            },
            velocity: {
                orbit: 5
            }
        }).on(obj.sun);

        obj.venus = Planet.create("venus", {
            layers: [
                Layer.create({
                    color: 0xE6D367,
                    size: 15,
                    sharpness: 2,
                }),
                Layer.create({
                    color: 0xFFF4BF,
                    size: 15,
                    sharpness: 4
                })
            ],
            orbit: {
                x: 350,
                y: 50,
                z: 300
            },
            velocity: {
                orbit: 3
            }
        }).on(obj.sun);

        obj.earth = Planet.create("earth", {
            layers: [
                Layer.create({
                    color: 0x4287F5,
                    size: 20,
                    sharpness: 0,
                }),
                Layer.create({
                    color: 0x4C9E3F,
                    size: 20,
                    sharpness: 2
                })
            ],
            orbit: {
                x: 450,
                y: 50,
                z: 450
            },
            velocity: {
                orbit: 2
            }
        }).on(obj.sun);

        obj.moon = Planet.create("moon", {
            layers: [
                Layer.create({
                    color: 0xFFFFFF,
                    size: 5,
                    sharpness: 0,
                })
            ],
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
            layers: [
                Layer.create({
                    color: 0x733D36,
                    size: 15,
                    sharpness: 2,
                })
            ],
            orbit: {
                x: 600,
                y: 300,
                z: 700
            },
            velocity: {
                orbit: 1.5
            }
        }).on(obj.sun);

        obj.jupiter = Planet.create("jupiter", {
            layers: [
                Layer.create({
                    color: 0xDECD78,
                    size: 60,
                    sharpness: 5,
                }),
                Layer.create({
                    color: 0xC7A740,
                    size: 61,
                    sharpness: 10,
                })
            ],
            ring: Ring.create({
                color: 0x917200,
                opacity: 0.5,
                radius: 90,
                thickness: 2,
                sharpness: 5,
            }),
            orbit: {
                x: 2300,
                y: 600,
                z: 2000
            },
            velocity: {
                orbit: 0.8
            }
        }).on(obj.sun);

        obj.saturn = Planet.create("saturn", {
            layers: [
                Layer.create({
                    color: 0xE3D591,
                    size: 50,
                    sharpness: 4,
                }),
                Layer.create({
                    color: 0xB8AA6A,
                    size: 50,
                    sharpness: 7,
                })
            ],
            ring: Ring.create({
                color: 0xD1BB56,
                opacity: 0.8,
                radius: 75,
                thickness: 5,
                sharpness: 3,
            }),
            orbit: {
                x: 2800,
                y: -400,
                z: 2600
            },
            velocity: {
                orbit: 0.5
            }
        }).on(obj.sun);

        obj.uranus = Planet.create("uranus", {
            layers: [
                Layer.create({
                    color: 0x379EB3,
                    size: 25,
                    sharpness: 5,
                }),
                Layer.create({
                    color: 0x48C2DB,
                    size: 25,
                    sharpness: 5,
                })
            ],
            orbit: {
                x: 3400,
                y: -50,
                z: 3600
            },
            velocity: {
                orbit: 0.3
            }
        }).on(obj.sun);

        obj.neptune = Planet.create("neptune", {
            layers: [
                Layer.create({
                    color: 0x0B54DB,
                    size: 30,
                    sharpness: 4,
                }),
                Layer.create({
                    color: 0x0948BD,
                    size: 30,
                    sharpness: 5,
                })
            ],
            orbit: {
                x: 4800,
                y: 400,
                z: 4900
            },
            velocity: {
                orbit: 0.1
            }
        }).on(obj.sun);

        obj.controls = new OrbitControls(obj.camera, obj.renderer.domElement);
        obj.controls.minDistance = 250;
        obj.controls.maxDistance = 6000;
        obj.controls.target.set(obj.scene.position.x, obj.scene.position.y, obj.scene.position.z);
        obj.controls.update();

        document.getElementById("loading").remove();
    },
    initialize_sun: () => {
        obj.sun = new Three.Mesh(new Three.SphereGeometry(100, 20, 20), new Three.MeshPhongMaterial({color: 0xF7DC6F}));
        obj.sun.castShadow = true;
        obj.sun.receiveShadow = true;
        for (let vertex of obj.sun.geometry.vertices) {
            vertex.ox = vertex.x;
            vertex.oy = vertex.y;
            vertex.oz = vertex.z;
        }
        obj.scene.add(obj.sun);

        //lights that will light the sun itself and no other object
        let sun_light_points = new Three.SphereGeometry(150, 8, 4);

        for (let vertex of sun_light_points.vertices) {
            let light = new Three.SpotLight(0xFFFFFF, 1.5, 200, 1);
            light.position.set(vertex.x, vertex.y, vertex.z);
            obj.scene.add(light);
        }

        //light for planets
        obj.sun_light = new Three.PointLight(0xFFFFFF, 1);
        obj.scene.add(obj.sun_light);
    },
    initialize_stars: () => {
        let geometry = new Three.Geometry();

        for (let i = 0; i < 500000; ++i) {
            geometry.vertices.push(random_vector(1000, 10000));
        }

        obj.stars = new Three.Points(geometry, new Three.PointsMaterial({color: 0xFFFFFF}));
        obj.scene.add(obj.stars);
    },
    animate: () => {
        console.log(obj.camera.position);
        for (let vertex of obj.sun.geometry.vertices) {
            vertex.x = within(vertex.x + (Math.random() - 0.5) * 2, vertex.ox, 5);
            vertex.y = within(vertex.y + (Math.random() - 0.5) * 2, vertex.oy, 5);
            vertex.z = within(vertex.z + (Math.random() - 0.5) * 2, vertex.oz, 5);
        }

        let time = Date.now() * 0.0005;
        obj.mercury.update(time);
        obj.venus.update(time);
        obj.earth.update(time);
        obj.moon.update(time);
        obj.mars.update(time);
        obj.jupiter.update(time);
        obj.saturn.update(time);
        obj.uranus.update(time);
        obj.neptune.update(time);

        obj.sun.geometry.verticesNeedUpdate = true;

        scene.render();
        //obj.stats.update();
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
