/**
 * @file        Layer class
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
import { TransitionPlugin } from './Transition/TransitionPlugin';
import { TransitionFilter } from './Transition/TransitionFilter';

/**
 * Class representing a Layer.
 * @extends PIXI.Graphics
 */
class Layer extends PIXI.Container {
    /**
     * Create a sprite.
     * It is a empty sprite, you should specify is content (use {@link Sprite#setFile}, for example) and call {@link Sprite#execSync}.
     */
  constructor() {
    super();
    this.zorder = 0;

    this.background = new PIXI.Graphics();
    this.addChild(this.background);

    this.setProperties({});

    this.filters = [new TransitionFilter()];
  }

    /**
     * Specify sprite index.
     * This method do not take effect until {@link Sprite#execSync} is called.
     * @param {number} index - the id of sprite
     * @returns {Sprite} - this
     */
  setIndex(index) {
    this.index = index;
    return this;
  }

    /**
     * Specify sprite area you wish to use in the sprite.
     * Usually you should not specify it, unless you wish to capture a part of the picture. <br>
     * This method do not take effect until {@link Sprite#execSync} is called.
     * @param {Array[]} index - the id of sprite
     * @returns {Sprite} - this
     */
  setProperties({ x, y, opacity, visible=true, width, height, fillColor, fillAlpha, anchor=[0,0] }) {
    this.x = (x != null) ? x : (this.x || 0);
    this.y = (y != null) ? y : (this.y || 0);
    this.alpha = (opacity != null) ? opacity : 1;
    this.visible = visible;
    this.rectWidth = width || this.rectWidth || 10;
    this.rectHeight = height || this.rectHeight || 10;
    this.fillColor = fillColor || this.fillColor || 0x000000;
    this.fillAlpha = fillAlpha || this.fillAlpha || 0;
    this.pivot = new PIXI.Point(Math.round(this.rectWidth * anchor[0]), Math.round(this.rectHeight * anchor[1]));
    this.background.clear();
    this.background.beginFill(this.fillColor, this.fillAlpha);
    this.background.drawRect(0, 0, this.rectWidth, this.rectHeight);
    this.background.endFill();
    this.filterArea = new PIXI.Rectangle(this.x - this.pivot.x,
      this.y - this.pivot.y,
      this.rectWidth + this.pivot.x,
      this.rectHeight + this.pivot.y);
    return this;
  }

  removeChildren() {
    super.removeChildren();
    this.addChild(this.background);
  }

  destroy() {
    this.background.destroy();
    super.destroy();
  }

}

TransitionPlugin(Layer);


export default Layer;
