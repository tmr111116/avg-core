/**
 * @file        Particle container
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2015-2017 Icemic Jia
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

import core from 'core/core';
const PIXI = require('pixi.js');
const particles = require('pixi-particles');
const logger = core.getLogger('Particle');

/**
 * Particle container class
 *
 * @export
 * @class ParticleContainer
 * @extends {PIXI.particles.ParticleContainer}
 */
export default class ParticleContainer extends PIXI.particles.ParticleContainer {
  constructor() {
    super(15000, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    }, 15000);

    this.emitter = new particles.Emitter(this);

    this.lastTime = Date.now();
  }

  /**
   * Initial particles
   * 
   * @param {object} art options
   * @param {string} art.src source of bitmap file
   * @param {array} [art.frames] divide texture to multiple parts, default to use the whole texture
   * @param {object} config particle configure
   * 
   * @memberOf ParticleContainer
   */
  init(art, config) {
    if (!art || !art.src) {
      logger.error('src cannot be null.');

      return;
    }

    const texture = core.getTexture(art.src);

    if (!art.frames) {

      this.emitter.init(texture, config);

    } else {
      const textures = [];

      for (const frame of art.frames) {
        const rect = new PIXI.Rectangle(...frame);

        textures.push(new PIXI.Texture(texture, rect));
      }

      this.emitter.init(textures, config);
    }

    this.emitter.emit = true;
  }

  updateTransform() {
    super.updateTransform();

    const now = Date.now();
    const deltaTime = now - this.lastTime;

    this.emitter.emit && this.emitter.update(deltaTime * 0.001);
    this.lastTime = now;
  }

  destroy(...args) {
    this.emitter.destroy();
    this.emitter = null;

    super.destroy(...args);
  }
}
