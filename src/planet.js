import * as Three from "../vendor/threejs/build/three.module.js";

export default class Planet {
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
            color: 0x333333,
            size: 50,
            sharpness: 5,
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
        let geometry = new Three.SphereGeometry(this.parameters.size, this.parameters.size, this.parameters.size);
        for(let vertex of geometry.vertices) {
            vertex.y += (Math.random() - 0.5) * this.parameters.sharpness;
        }

        this.mesh = new Three.Mesh(geometry, new Three.MeshLambertMaterial({color: this.parameters.color}));
        this.mesh.name = this.name;
        this.mesh.position
    }

    update(time) {
        let orbit = this.parameters.orbit;
        let velocity = this.parameters.velocity.orbit;

        this.mesh.position.x = Math.sin(time * velocity) * (orbit.x);
        this.mesh.position.y = Math.sin(time * velocity) * (orbit.y);
        this.mesh.position.z = Math.cos(time * velocity) * (orbit.z);
    }

    on(object) {
        if(object.type == "Scene") {
            object.add(this.mesh);
        } else {
            object.mesh.add(this.mesh);
        }

        return this;
    }
}
