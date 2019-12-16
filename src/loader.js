import * as Three from "../vendor/threejs/build/three.module.js";
import {FBXLoader} from '../vendor/threejs/examples/jsm/loaders/FBXLoader.js';

let fbx_loader = new FBXLoader();

function loadFBX(path, destination) {
    return new Promise(function (resolve, reject) {
        fbx_loader.load(path, function (object) {
            object.traverse(function (child) {
                if (child instanceof Three.Mesh) {
                    child.castShadow = true;
                }
            });

            eval("Models." + destination + " = object;");
            resolve();
        }, null, (err) => {
            reject(err);
        });
    });
}

export var Models = {};

export var Loader = new Promise((resolve, reject) => {
    document.getElementById("loading").remove();
    resolve();
});

