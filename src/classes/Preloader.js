/**
 * @file        General resource preloader class
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2015-2016 Icemic Jia
 * @link        https://www.avgjs.org
 * @license     Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const PIXI = require('pixi.js');
const Err = require('./ErrorHandler');

const TEXTURES = {};

export function load(resources, onProgress) {
  const loader = new PIXI.loaders.Loader('http://cdn.bakery.moe/'); // http://7xi9kn.com1.z0.glb.clouddn.com
  for (const res of [...new Set(resources)]) {
    loader.add(res, res);
  }
  const promise = new Promise((resolve, reject) => {
    loader.once('complete', resolve);
    loader.once('error', reject);
    loader.on('progress', onProgress);
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
