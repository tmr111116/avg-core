/**
 * @file        General event handle module
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

import Err from './ErrorHandler';

export function attachToSprite(sprite) {
  sprite.interactive = true;
  sprite.on('click', handleEvent);
  sprite.on('tap', handleEvent);
  sprite.on('mousemove', handleEvent);
  sprite.on('mouseover', handleEvent);
  sprite.on('mouseout', handleEvent);
  sprite.on('mousedown', handleEvent);
  sprite.on('mouseup', handleEvent);
  sprite.on('mouseupoutside', handleEvent);
  sprite.on('touchstart', handleEvent);
  sprite.on('touchmove', handleEvent);
  sprite.on('touchend', handleEvent);
  sprite.on('touchendoutside', handleEvent);
}

// let Handler;
// export function registerHandler(handler) {
//   if (typeof handler === 'function')
//     Handler = handler;
//   else {
//     Err.warn('[EventManager] Event Handler must be a function, ignored.');
//   }
// }

function handleEvent(evt) {
  const e = new EventData(evt);
  // if (Handler) {
  //   Handler(e);
  // } else {
  const defaultHandler = e.target[`_on${e.type}`];
  defaultHandler && defaultHandler(e);
  // }
}

class EventData {
  constructor(evt) {
    this.type = evt.type;
    this.originalEvent = evt;
    this.index = evt.target.index;
    this.target = evt.target;
    this.global = {
      x: evt.data.global.x,
      y: evt.data.global.y,
    };
    this.local = evt.target.toLocal(this.global);

    // 有时候会有奇怪的触发，导致 data.originalEvent 是 null……
    if (evt.data.originalEvent) {
      this.movement = {
        x: evt.data.originalEvent.movementX,
        y: evt.data.originalEvent.movementY,
      };
    } else {
      this.movement = { x: 0, y: 0 };
    }
  }
  stopPropagation() {
    this.originalEvent.stopped = true;
  }
}
