/**
 * @file        Abstract filter class
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

export default class AbstractFilter extends PIXI.Filter {
  constructor(vertex, frag, uniforms) {
    const _uniforms = {
      previousTexture: { type: 'sampler2D', value: PIXI.Texture.EMPTY },
      progress: { type: '1f', value: 0 },
      currentTime: { type: '1f', value: 0 },
    };

    super(vertex, frag, Object.assign(_uniforms, uniforms));

    this.padding = 0;

    this.startTime = 0;
    this.duration = 5000;

    this.finished = false;
  }

  reset() {
    this.startTime = 0;
    this.finished = false;
  }

  setPreviousTexture(texture) {
    this.uniformData.previousTexture.value = texture;
    this.uniforms.previousTexture = texture;
  }


  setNextTexture(texture) {
    // this.uniformData.nextTexture.value = texture;
    // this.uniforms.nextTexture = texture;
  }

  apply(filterManager, input, output, clear) {
    const matrix = new PIXI.Matrix();
    filterManager.calculateNormalizedScreenSpaceMatrix(matrix);
    this.uniforms.filterMatrix = matrix;
    this.uniformData.filterMatrix = { type: 'mat3', value: matrix };
    this.uniforms.resolution = PIXI.settings.RESOLUTION;
    this.uniformData.resolution = { type: '1f', value: PIXI.settings.RESOLUTION };
    return super.apply(filterManager, input, output, clear);
  }

    // 返回false说明转场未完成，返回true说明完成
  update(time) {
    // 第一次执行.update()时初始化
    if (!this.startTime) {
      this.startTime = time;
      return false;
    }

    // 判断转场是否完成
    if (time - this.startTime >= this.duration) {
      this.uniformData.progress.value = 1;
      this.uniforms.progress = 1;
      this.uniformData.currentTime.value = this.duration;
      this.uniforms.currentTime = this.duration;
      this.finished = true;
      return true;
    }

    this.uniformData.progress.value = (time - this.startTime) / this.duration;
    this.uniforms.progress = (time - this.startTime) / this.duration;
    this.uniformData.currentTime.value = time - this.startTime;
    this.uniforms.currentTime = time - this.startTime;
    return false;
  }

}
