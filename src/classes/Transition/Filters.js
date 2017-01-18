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

const PIXI = require('pixi.js');

const commonVertex = require(__dirname + '/shaders/common.vert');

export class CrossFadeFilter extends AbstractFilter {
  constructor(duration = 1000) {
    super(commonVertex,
        require(__dirname + '/shaders/crossfade.frag'));

    this.duration = duration;
  }
}

export class UniversalFilter extends AbstractFilter {
  constructor(ruleFile, vague = 0.25, duration = 1000) {
    const ruleTexture = core.getTexture(ruleFile);

    super(commonVertex,
        require(__dirname + '/shaders/universal.frag'),
      {
        vague: { type: '1f', value: vague },
        ruleTexture: { type: 'sampler2D', value: ruleTexture },
      });

    this.duration = duration;
  }
}

export class ShutterFilter extends AbstractFilter {
  constructor(direction = 'left', num = 16, duration = 1000) {
    // 0 for left(from left), 0.25 for right, 0.5 for top, 0.75 for bottom
    const directionValue = Math.max(0, ['left', 'right', 'top', 'bottom'].indexOf(direction)) * 0.25;

    super(commonVertex,
        require(__dirname + '/shaders/shutter.frag'),
      {
        direction: { type: '1f', value: directionValue },
        num: { type: '1f', value: num },
      });

    this.duration = duration;
  }
}

export class RippleFilter extends AbstractFilter {
  constructor(origin = [0.5, 0.5], speed = 1, count = [10, 10], maxDrift = 24, duration = 1000) {
    super(commonVertex,
        require(__dirname + '/shaders/ripple.frag'),
      {
        count: { type: '2f', value: count },
        origin: { type: '2f', value: origin },
        speed: { type: '1f', value: speed },
        maxDrift: { type: '1f', value: maxDrift },
      });

    this.duration = duration;
  }
}
