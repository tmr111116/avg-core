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

    this.setProperties({
      x: 0,
      y: 0,
      opacity: 1,
      visible: true,
      width: 10,
      height: 10,
      fillColor: 0x000000,
      fillAlpha: 0,
      anchor: [0, 0]
    });

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
  setProperties({ x, y, opacity, visible, width, height, fillColor, fillAlpha, anchor }) {
    (x != null) && (this.x = x);
    (y != null) && (this.y = y);
    (opacity != null) && (this.alpha = opacity);
    (visible != null) && (this.visible = visible);
    (width != null) && (this.rectWidth = width);
    (height != null) && (this.rectHeight = height);
    (fillColor != null) && (this.fillColor = fillColor);
    (fillAlpha != null) && (this.fillAlpha = fillAlpha);
    (anchor != null) && (this.pivot = new PIXI.Point(Math.round(this.rectWidth * anchor[0]), Math.round(this.rectHeight * anchor[1])));
    this.background.clear();
    this.background.beginFill(this.fillColor, this.fillAlpha);
    this.background.drawRect(0, 0, this.rectWidth, this.rectHeight);
    this.background.endFill();

    {
      let time = 0;
      const tick = () => {
        if (this.parent) {
          const point = this.toGlobal(new PIXI.Point(0, 0));
          // setTimeout(() => console.log(this.toGlobal(new PIXI.Point(0, 0)), this.parent), 500)
          // console.log(point, this.pivot, this.parent)
          // console.log(this.position.x, point.x)
          // const point = this.position;
          this.filterArea = new PIXI.Rectangle(point.x - this.pivot.x,
            point.y - this.pivot.y,
            this.rectWidth + this.pivot.x,
            this.rectHeight + this.pivot.y);
        } else if (!this.parent && time < 1000) {
          time += 50;
          setTimeout(tick, 50);
        }
      }
      tick();
    }

    return this;
  }

  containsPoint(...args) {
    return this.background.containsPoint(...args);
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
