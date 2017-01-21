/**
 * @file        Special injection filter for transition
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

// const DefaultShader = require('pixi.js/src/core/renderers/webgl/shaders/TextureShader');
import core from 'core/core';
import FrozenTextureFilter from './FrozenTextureFilter';

const PIXI = require('pixi.js');

const logger = core.getLogger('TransitionFilter');

const EmptyTexureShaderFragment = require(`${__dirname}/shaders/emptyTexture.frag`);
const PrepareTransitionShaderFragment = require(`${__dirname}/shaders/prepareTransition.frag`);
const EmptyTexureShaderVertex = require(`${__dirname}/shaders/emptyTexture.vert`);
const PrepareTransitionShaderVertex = require(`${__dirname}/shaders/prepareTransition.vert`);

export class TransitionFilter extends PIXI.Filter {
  constructor() {
    super(EmptyTexureShaderVertex, EmptyTexureShaderFragment, {
      // texture: { type: 'sampler2D', value: PIXI.Texture.EMPTY },
    });

    // this.glShaderKey = 'transition';
    this.padding = 0;

    this.filter = null;
    this.start = false;
    this.block = false;

    this.resolveCallback = null;

    this.filterType = 'Transition';

    // this.emptyTextureShader = this.prepareTransitionShader = null;

    this.frozenTextureFilter = new FrozenTextureFilter();
    this.frozenTexture = null;
  }

  setPreviousTexture(texture) {
    // this.uniformData.texture = { type: 'sampler2D', value: texture };
    // this.uniforms.texture = texture;
    this.frozenTextureFilter.setTexture(texture);
    this.frozenTexture = texture;
  }

    /*
      说明：
        `texture`是将要变化到的图像
        `filter`变换用的Shader
    */
  startTransition(texture, filter) {
    // 判断当前是否处于pretrans状态
    if (!this.frozenTexture) {
      logger.error('PreviousTexture must be provided.');

      return Promise.resolve();
    }

    filter.setPreviousTexture(this.frozenTexture);
    filter.setNextTexture(texture);
    this.frozenTexture = null;
    // delete this.uniformData.texture;
    // delete this.uniforms.texture;
    this.filter = filter;
    this.start = true;

    return new Promise(resolve => {
      this.resolveCallback = resolve;
    });
  }

  completeTransition() {
    this.start = false;
    this.filter = null;
    this.resolveCallback && this.resolveCallback();
    this.resolveCallback = null;
  }

  setBlocked(bool = true) {
    this.block = bool;
  }

  apply(filterManager, input, output, clear) {
    // this.applyShader();
    if (this.start && this.filter) {
      const filter = this.filter;

      const matrix = new PIXI.Matrix();

      filterManager.calculateNormalizedScreenSpaceMatrix(matrix);
      filter.uniforms.filterMatrix = matrix;
      filter.uniformData.filterMatrix = { type: 'mat3', value: matrix };
      filter.uniforms.resolution = PIXI.settings.RESOLUTION;
      filter.uniformData.resolution = { type: '1f', value: PIXI.settings.RESOLUTION };

      const finished = filter.update(Date.now());

      filterManager.applyFilter(filter, input, output, clear);
      if (finished) {
        this.start = false;
        this.filter = null;
        this.resolveCallback();
        this.resolveCallback = null;
      }
    } else if (this.frozenTexture) {
      const filter = this.frozenTextureFilter;

      const matrix = new PIXI.Matrix();

      filterManager.calculateNormalizedScreenSpaceMatrix(matrix);
      filter.uniforms.filterMatrix = matrix;
      filter.uniformData.filterMatrix = { type: 'mat3', value: matrix };
      filter.uniforms.resolution = PIXI.settings.RESOLUTION;
      filter.uniformData.resolution = { type: '1f', value: PIXI.settings.RESOLUTION };
      filterManager.applyFilter(filter, input, output, clear);
      // filterManager.applyFilter(this, input, output, clear);

    } else if (this.start) {
      logger.error('Filter must be provided.');
      this.start = false;
      this.resolveCallback();
      this.resolveCallback = null;
    } else {
      filterManager.applyFilter(this, input, output, clear);
    }
  }

  // applyFilter(renderer, input, output, clear) {
  //   if (this.start && this.filter) {
  //     const filter = this.filter;
  //     const finished = filter.update(Date.now());
  //     filter.applyFilter(renderer, input, output, clear);
  //     if (finished) {
  //       this.start = false;
  //       this.filter = null;
  //       this.resolveCallback();
  //       this.resolveCallback = null;
  //     }
  //   } else if (this.uniforms.texture.value) {
  //     super.applyFilter(renderer, input, output, clear);
  //   } else if (this.start) {
  //     logger.error('Filter must be provided.');
  //     this.start = false;
  //     this.resolveCallback();
  //     this.resolveCallback = null;
  //   } else {
  //     super.applyFilter(renderer, input, output, clear);
  //   }
  // }

  applyShader() {
    // if (!this.emptyTextureShader)
    //   this.emptyTextureShader = new DefaultShader(renderer.shaderManager,
    //             EmptyTexureShaderVertex,
    //             EmptyTexureShaderFragment,
    //             this.uniforms,
    //             this.attributes
    //         );
    // if (!this.prepareTransitionShader)
    //   this.prepareTransitionShader = new DefaultShader(renderer.shaderManager,
    //             PrepareTransitionShaderVertex,
    //             PrepareTransitionShaderFragment,
    //             this.uniforms,
    //             this.attributes
    //         );
        // console.log(this.uniforms.texture)
    this.glShaders = [];
    if (this.block) {
      this.vertexSrc = EmptyTexureShaderVertex;
      this.fragmentSrc = EmptyTexureShaderFragment;
    }

    if (this.uniforms.texture) {
      this.vertexSrc = PrepareTransitionShaderVertex;
      this.fragmentSrc = PrepareTransitionShaderFragment;
    } else {
      this.vertexSrc = EmptyTexureShaderVertex;
      this.fragmentSrc = EmptyTexureShaderFragment;
    }
  }

  syncUniform(uniform) {
    logger.warn('Method syncUniform() should not be called, it\'s a bug!');
    super.syncUniform(uniform);
  }
}
