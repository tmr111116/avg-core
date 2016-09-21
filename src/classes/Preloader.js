const PIXI = require('../library/pixi.js/src/index');
const Err = require('./ErrorHandler');

const TEXTURES = {};

export function load(resources) {
  const loader = new PIXI.loaders.Loader('/'); // https://7xi9kn.com1.z0.glb.clouddn.com
  for (const res of [...new Set(resources)]) {
    loader.add(res, res);
  }
  const promise = new Promise((resolve, reject) => {
    loader.once('complete', resolve);
    loader.once('error', reject);
  });
  loader.load((loader, resources) => {
    Object.assign(TEXTURES, resources);
  });
  return promise;
}

export function getTexture(url) {
  const obj = TEXTURES[url];
  if (obj) {
    return obj.texture;
  } else {
    return PIXI.Texture.fromImage(url);
  }
}
