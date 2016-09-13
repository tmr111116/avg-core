var PIXI = require('../Library/pixi.js/src/index');
var Err = require('./ErrorHandler');

const TEXTURES = {};

export function load(resources) {
    var loader = new PIXI.loaders.Loader('https://7xi9kn.com1.z0.glb.clouddn.com');
    for (let res of resources) {
        loader.add(res, res);
    }
    let promise = new Promise((resolve, reject) => {
        loader.once('complete', resolve);
        loader.once('error', reject);
    });
    loader.load(function (loader, resources) {
        Object.assign(TEXTURES, resources);
    });
    return promise;
}

export function getTexture(url) {
    let obj = TEXTURES[url];
    if (obj) {
        return obj.texture;
    } else {
        return PIXI.Texture.fromImage(url);
    }
}
