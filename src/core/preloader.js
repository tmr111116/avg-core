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
const Err = require('classes/ErrorHandler');

let TEXTURES = {};
let AUDIOS = {};
let VIDEOS = {};
let SCRIPTS = {};
let HOST = '/';

const Resource = PIXI.loaders.Loader.Resource;

Resource.setExtensionLoadType('wav', Resource.LOAD_TYPE.AUDIO);
Resource.setExtensionLoadType('mp3', Resource.LOAD_TYPE.AUDIO);
Resource.setExtensionLoadType('ogg', Resource.LOAD_TYPE.AUDIO);

Resource.setExtensionLoadType('mp4', Resource.LOAD_TYPE.VIDEO);
Resource.setExtensionLoadType('webm', Resource.LOAD_TYPE.VIDEO);

Resource.setExtensionXhrType('bkc', Resource.XHR_RESPONSE_TYPE.JSON);
Resource.setExtensionXhrType('bks', Resource.XHR_RESPONSE_TYPE.TEXT);

Resource.setExtensionXhrType('ttf', Resource.XHR_RESPONSE_TYPE.BUFFER);
Resource.setExtensionXhrType('otf', Resource.XHR_RESPONSE_TYPE.BUFFER);


export function init(host) {
  TEXTURES = {};
  HOST = host || HOST;
}

export function load(resources, onProgress) {
  const loader = new PIXI.loaders.Loader(HOST); // http://7xi9kn.com1.z0.glb.clouddn.com
  for (const res of [...new Set(resources)]) {
    loader.add(res, res);
  }
  const promise = new Promise((resolve, reject) => {
    loader.once('complete', resolve);
    loader.once('error', reject);
    loader.on('progress', onProgress);
  });
  loader.load((loader, resources) => {
    // `resources` is a Object
    for (let name in resources){
      let res = resources[name];
      if (res.isImage) {
        TEXTURES[name] = res.texture;
      } else if (res.isAudio) {
        AUDIOS[name] = res.data;  // audio object
      } else if (res.isVideo) {
        VIDEO[name] = res.data;
      }
    }
    // Object.assign(TEXTURES, resources);
  });
  return promise;
}

export function getTexture(url) {
  let obj = TEXTURES[url];
  if (!obj) {
    obj = PIXI.Texture.fromImage(url ? `${HOST}${url}` : '');
    TEXTURES[url] = obj;
  }
  return new PIXI.Texture(obj.baseTexture);
}

export function getAudio(url) {
  const obj = AUDIOS[url];
  if (obj) {
    return obj;
  } else {
    const audio = new Audio();
    audio.src = `${HOST}${url}`;
    audio.preload = 'auto';
    audio.load();
    return audio;
  }
}
