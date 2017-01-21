/**
 * @file        Filter classes
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

import core from 'core/core';
import AbstractFilter from './AbstractFilter';

const commonVertex = require(`${__dirname}/shaders/common.vert`);
const crossfadeFrag = require(`${__dirname}/shaders/crossfade.frag`);
const universalFrag = require(`${__dirname}/shaders/universal.frag`);
const shutterFrag = require(`${__dirname}/shaders/shutter.frag`);
const rippleFrag = require(`${__dirname}/shaders/ripple.frag`);

/**
 * Supply crossfade transition
 *
 * @export
 * @class CrossFadeFilter
 * @extends {AbstractFilter}
 */
export class CrossFadeFilter extends AbstractFilter {

  /**
   * Creates an instance of CrossFadeFilter.
   *
   * @param {number} [duration=1000]
   *
   * @memberOf CrossFadeFilter
   */
  constructor(duration = 1000) {
    super(commonVertex, crossfadeFrag);

    this.duration = duration;
  }
}

/**
 * Supply universal transition
 *
 * @export
 * @class UniversalFilter
 * @extends {AbstractFilter}
 */
export class UniversalFilter extends AbstractFilter {

  /**
   * Creates an instance of UniversalFilter.
   *
   * @param {any} ruleFile
   * @param {number} [vague=0.25]
   * @param {number} [duration=1000]
   *
   * @memberOf UniversalFilter
   */
  constructor(ruleFile, vague = 0.25, duration = 1000) {
    const ruleTexture = core.getTexture(ruleFile);

    super(commonVertex, universalFrag, {
      vague: { type: '1f', value: vague },
      ruleTexture: { type: 'sampler2D', value: ruleTexture },
    });

    this.duration = duration;
  }
}

/**
 * Supply shutter transition
 *
 * @export
 * @class ShutterFilter
 * @extends {AbstractFilter}
 */
export class ShutterFilter extends AbstractFilter {

  /**
   * Creates an instance of ShutterFilter.
   *
   * @param {string} [direction='left']
   * @param {number} [num=16]
   * @param {number} [duration=1000]
   *
   * @memberOf ShutterFilter
   */
  constructor(direction = 'left', num = 16, duration = 1000) {
    // 0 for left(from left), 0.25 for right, 0.5 for top, 0.75 for bottom
    const directionValue = Math.max(0, ['left', 'right', 'top', 'bottom'].indexOf(direction)) * 0.25;

    super(commonVertex, shutterFrag, {
      direction: { type: '1f', value: directionValue },
      num: { type: '1f', value: num },
    });

    this.duration = duration;
  }
}

/**
 * Supply ripple transition
 *
 * @export
 * @class RippleFilter
 * @extends {AbstractFilter}
 */
export class RippleFilter extends AbstractFilter {

  /**
   * Creates an instance of RippleFilter.
   *
   * @param {any} [origin=[0.5, 0.5]]
   * @param {number} [speed=1] cycles per second
   * @param {any} [count=[10, 10]]
   * @param {number} [maxDrift=24]
   * @param {number} [duration=1000]
   *
   * @memberOf RippleFilter
   */
  constructor(origin = [0.5, 0.5], speed = 1, count = [10, 10], maxDrift = 24, duration = 1000) {
    super(commonVertex, rippleFrag, {
      count: { type: '2f', value: count },
      origin: { type: '2f', value: origin },
      speed: { type: '1f', value: speed },
      maxDrift: { type: '1f', value: maxDrift },
    });

    this.duration = duration;
  }
}
