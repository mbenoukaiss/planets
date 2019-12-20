import * as Three from "../vendor/threejs/build/three.module.js";

export class Planet {
    mesh;

    name;
    parameters;

    static create(name, parameters) {
        let planet = new Planet();
        planet.name = name;
        planet.parameters = {...planet.parameters, ...parameters};

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
            velocity: {
                orbit: 1,
                rotation: 10
            },
        }
    }

    initialize() {
        this.mesh = new Three.Object3D();

        for(let layer of this.parameters.layers) {
            this.mesh.add(layer.mesh);
        }

        if(this.parameters.ring != null) {
            this.mesh.add(this.parameters.ring.mesh);
        }
    }

    update(time) {
        let orbit = this.parameters.orbit;
        let velocity = this.parameters.velocity.orbit;

        this.mesh.position.x = Math.sin(time * velocity) * (orbit.x);
        this.mesh.position.y = Math.sin(time * velocity) * (orbit.y);
        this.mesh.position.z = Math.cos(time * velocity) * (orbit.z);
    }

    on(object) {
        if (object.type === "Scene" || object.type === "Mesh") {
            object.add(this.mesh);
        } else {
            object.mesh.add(this.mesh);
        }

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
        let geometry = new Three.SphereGeometry(this.parameters.size, this.parameters.size / 2, this.parameters.size / 2);
        for(let vertex of geometry.vertices) {
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
        let geometry = new Three.CylinderGeometry(this.parameters.radius, this.parameters.radius, this.parameters.thickness, this.parameters.radius / 2, this.parameters.thickness / 2);
        for(let vertex of geometry.vertices) {
            vertex.x += (Math.random() - 0.5) * this.parameters.sharpness;
            vertex.y += (Math.random() - 0.5) * this.parameters.sharpness;
            vertex.z += (Math.random() - 0.5) * this.parameters.sharpness;
        }

        this.mesh = new Three.Mesh(geometry, new Three.MeshLambertMaterial({color: this.parameters.color, transparent: true, opacity: this.parameters.opacity}));
    }
}
