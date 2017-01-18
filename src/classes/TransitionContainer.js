/**
 * @file        Container that provides transition functions
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

import Logger from 'core/logger';
import { CrossFadeFilter,
         UniversalFilter,
         ShutterFilter,
         RippleFilter,
       } from 'classes/Transition/Filters';

const PIXI = require('pixi.js');

const logger = Logger.create('TransitionContainer');

export default class TransitionContainer extends PIXI.Sprite {
  constructor() {
    super();

    this.renderer = null;

    // container, prepare, transition
    this.status = 'container';

  }
  prepare(_filter, params) {

    let filter;

    if (typeof _filter === 'string') {
      switch (_filter.toLowerCase()) {
        case 'crossfade':
          filter = new CrossFadeFilter(params.duration);
          break;
        case 'universal': {
          const { ruleFile, vague, duration } = params;
          filter = new UniversalFilter(ruleFile, vague, duration);
          break;
        }
        case 'shutter': {
          const { direction, num, duration } = params;
          filter = new ShutterFilter(direction, num, duration);
          break;
        }
        case 'ripple': {
          const { origin, speed, length, maxDrift, duration } = params;
          filter = new RippleFilter(origin, speed, length, maxDrift, duration);
          break;
        }
        default:
          logger.error(`Unrecognized filter '${_filter}'.`);
      }
    } else {
      filter = _filter;
    }

    filter.reset();
    this.filter = filter;

    const renderer = this.renderer;
    const texture = PIXI.RenderTexture.create(renderer.width, renderer.height,
    PIXI.settings.SCALE_MODE, renderer.resolution);

    if (this.visible) {
      renderer.render(this, texture);
    }

    this.status = 'prepare';

    filter.setPreviousTexture(texture);
  }
  start() {
    const renderer = this.renderer;
    const texture = PIXI.RenderTexture.create(renderer.width, renderer.height,
      PIXI.settings.SCALE_MODE, renderer.resolution);

    this.filter.enabled = false;
    renderer.render(this, texture);
    this.filter.enabled = true;

    this.status = 'transition';
  }
  renderWebGL(renderer) {
    if (this.renderer !== renderer) {
      this.renderer = renderer;
    }

    if (this.status === 'container') {
      PIXI.Container.prototype.renderWebGL.call(this, renderer);
      return;
    } else if (this.status === 'transition') {
      const finished = this.filter.update(performance.now());
      if (finished) {
        this.status = 'container';
      }
    }
    renderer.flush();
    renderer.filterManager.pushFilter(this, [this.filter]);
    super.renderWebGL(renderer);
    renderer.filterManager.popFilter();
    renderer.flush();
  }
}
