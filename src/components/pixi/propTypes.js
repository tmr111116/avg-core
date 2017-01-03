/**
 * @file        PropTypes defination of PIXI.DisplayObjectContainer
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

import React from 'react';

export default {
  alpha: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  position: React.PropTypes.arrayOf(React.PropTypes.number),
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  pivot: React.PropTypes.arrayOf(React.PropTypes.number),
  anchor: React.PropTypes.arrayOf(React.PropTypes.number),
  rotation: React.PropTypes.number,
  scale: React.PropTypes.arrayOf(React.PropTypes.number),
  skew: React.PropTypes.arrayOf(React.PropTypes.number),
  tint: React.PropTypes.oneOf([React.PropTypes.number, React.PropTypes.string]),
  cacheAsBitmap: React.PropTypes.bool,
  children: React.PropTypes.any,
  visible: React.PropTypes.bool,
};
