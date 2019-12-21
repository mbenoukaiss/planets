import * as Three from "../vendor/threejs/build/three.module.js";
import {merge} from "./utils.js";

export class Planet {
    center;
    mesh;

    name;
    parameters;

    static create(name, parameters) {
        let planet = new Planet();
        planet.name = name;
        planet.parameters = merge(planet.parameters, parameters);

        planet.initialize();
        return planet;
    }

    constructor() {
        this.parameters = {
            layers: [],
            ring: null,
            distance: 200,
            orbit: {
                x: 50,
                y: 100,
                z: 70
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            velocity: {
                orbit: 1,
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
        }
    }

    initialize() {
        this.center = new Three.Object3D();
        this.mesh = new Three.Object3D();
        this.mesh.rotation.set(this.parameters.rotation.x, this.parameters.rotation.y, this.parameters.rotation.z);

        for (let layer of this.parameters.layers) {
            this.mesh.add(layer.mesh);
        }

        if (this.parameters.ring != null) {
            this.mesh.add(this.parameters.ring.mesh);
        }

        this.center.add(this.mesh);
    }

    update(time) {
        let orbit = this.parameters.orbit;
        let velocity = this.parameters.velocity.orbit;

        this.center.position.x = Math.sin(time * velocity) * (orbit.x);
        this.center.position.y = Math.sin(time * velocity) * (orbit.y);
        this.center.position.z = Math.cos(time * velocity) * (orbit.z);

        this.mesh.rotation.x += this.parameters.velocity.rotation.x;
        this.mesh.rotation.y += this.parameters.velocity.rotation.y;
        this.mesh.rotation.z += this.parameters.velocity.rotation.z;
    }

    add(object) {
        this.center.add(object);
    }

    remove(object) {
        this.center.remove(object);
    }

    on(object) {
        object.add(this.center);
        return this;
    }
}

export class Layer {
    mesh;

    parameters;

    static create(parameters) {
        let layer = new Layer();
        layer.parameters = {...layer.parameters, ...parameters};

        layer.initialize();
        return layer;
    }

    constructor() {
        this.parameters = {
            color: 0x333333,
            size: 50,
            sharpness: 5,
        }
    }

    initialize() {
        let geometry = new Three.SphereGeometry(this.parameters.size, this.parameters.size, this.parameters.size);
        for (let vertex of geometry.vertices) {
            vertex.x += (Math.random() - 0.5) * this.parameters.sharpness;
            vertex.y += (Math.random() - 0.5) * this.parameters.sharpness;
            vertex.z += (Math.random() - 0.5) * this.parameters.sharpness;
        }

        this.mesh = new Three.Mesh(geometry, new Three.MeshLambertMaterial({color: this.parameters.color}));
    }
}


export class Ring {
    mesh;

    parameters;

    static create(parameters) {
        let ring = new Ring();
        ring.parameters = {...ring.parameters, ...parameters};

        ring.initialize();
        return ring;
    }

    constructor() {
        this.parameters = {
            color: 0x333333,
            opacity: 0.75,
            radius: 70,
            thickness: 5,
            sharpness: 5,
        }
    }

    initialize() {
        let geometry = new Three.CylinderGeometry(this.parameters.radius, this.parameters.radius, this.parameters.thickness, this.parameters.radius, this.parameters.thickness);
        for (let vertex of geometry.vertices) {
            vertex.x += (Math.random() - 0.5) * this.parameters.sharpness;
            vertex.y += (Math.random() - 0.5) * this.parameters.sharpness;
            vertex.z += (Math.random() - 0.5) * this.parameters.sharpness;
        }

        this.mesh = new Three.Mesh(geometry, new Three.MeshLambertMaterial({
            color: this.parameters.color,
            transparent: true,
            opacity: this.parameters.opacity
        }));
    }
}
