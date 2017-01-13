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

import AbstractFilter from './AbstractFilter';
const PIXI = require('pixi.js');
import core from 'core/core';

const commonVertex = require(__dirname + '/shaders/common.vert');

export class CrossFadeFilter extends AbstractFilter {
  constructor(duration = 1000) {
    super(commonVertex,
        require(__dirname + '/shaders/crossfade.frag'));

    this.duration = duration;
  }
}
export class UniversalFilter extends AbstractFilter {
  constructor(ruleFile, vague = 64, duration = 1000) {
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
  constructor(direction = 0, num = 16, duration = 1000) {
    super(commonVertex,
        require(__dirname + '/shaders/shutter.frag'),
      {
        direction: { type: '1f', value: direction },
        num: { type: '1f', value: num },
      });

    this.duration = duration;
  }
}
export class RippleFilter extends AbstractFilter {
  constructor(ratio, origin, phase, drift, duration = 1000) {
    super(commonVertex,
        require(__dirname + '/shaders/shutter.frag'),
      {
        ratio: { type: '2f', value: {
          x: ratio.x,
          y: ratio.y,
        } },
        origin: { type: '2f', value: {
          x: origin.x,
          y: origin.y,
        } },
        phase: { type: '1f', value: phase },
        drift: { type: '1f', value: drift },
      });

    this.duration = duration;
  }
}
