/**
 * @file        Tween utils
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

const logger = Logger.create('TweenBuilder');
// const logger = console;

class TweenBuilderChain {
  constructor() {

    this.chain = {};
    this.isInScheme = false;

    // items always be Object
    this.nodeStack = [];

    // always be Array.
    this.currentNode = null;
  }
  scheme(name) {
    if (this.isInScheme) {
      logger.error('You should call .end() to close current scheme before creating a new one.');
    } else {
      this.chain[name] = {
        type: 'sequence',
        actions: [],
        repeat: 0,
        yoyo: false,
      };
      this.currentNode = this.chain[name].actions;
      this.nodeStack.push(this.chain);
      this.isInScheme = true;
    }

    return this;
  }
  sequence(repeat = 0, yoyo = false) {
    this._checkInScheme();
    const sequenceNode = {
      type: 'sequence',
      actions: [],
      repeat,
      yoyo,
    };

    this.currentNode.push(sequenceNode);
    this.nodeStack.push(this.currentNode);
    this.currentNode = sequenceNode.actions;

    return this;
  }
  parallel(repeat = 0, yoyo = false) {
    this._checkInScheme();
    const parallelNode = {
      type: 'parallel',
      actions: [],
      repeat,
      yoyo,
    };

    this.currentNode.push(parallelNode);
    this.nodeStack.push(this.currentNode);
    this.currentNode = parallelNode.actions;

    return this;
  }
  end() {
    const node = this.nodeStack.pop();

    if (this.nodeStack.length) {
      this.currentNode = node;
    } else {
      // end scheme
      this.isInScheme = false;
      this.currentNode = null;
    }

    return this;
  }
  _checkInScheme() {
    if (this.isInScheme) {
      return true;
    }
    logger.error('You must specify a scheme first.');

    return false;
  }
  getSchemes() {
    return this.chain;
  }
}

((...actionNames) => {
  for (const actionName of actionNames) {
    Object.defineProperty(TweenBuilderChain.prototype, actionName, {
      value(target, params, duration = 0, easing = x => x, repeat = 0, yoyo = false) {
        this._checkInScheme();
        const action = {
          type: 'action',
          name: actionName,
          target,
          params,
          duration,
          easing,
          repeat,
          yoyo,
        };

        this.currentNode.push(action);

        return this;
      },
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
})('moveTo', 'moveBy',
   'fadeTo', 'fadeBy',
   'delay',
   'rotateTo', 'rotateBy',
   'scaleTo', 'scaleBy',
   'tintTo', 'tintBy',
   'shake', 'quake',
   'setProperty', 'callback');

export default function tweenBuilder() {
  return new TweenBuilderChain();
}
