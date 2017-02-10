/**
 * @file        Tween performance
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

const PIXI = require('pixi.js');
const logger = Logger.create('Tween');

class Ticker {
  constructor() {
    const performance = window.performance || window.Date;

    this._update = () => {
      this.update(performance.now());
    };
  }
  start() {
    PIXI.ticker.shared.add(this._update);
  }
  stop() {
    PIXI.ticker.shared.remove(this._update);
  }
  update() {

  }
}

class AbstractAction extends Ticker {
  constructor(target, params, duration, easing, repeat, yoyo) {
    super();

    this.target = target;
    this.params = params;
    this.duration = duration;
    this.easing = easing;
    this.repeat = repeat;
    this.yoyo = yoyo;

    this.reset();
  }

  reset() {
    this.finished = false;
    this.times = 0;
    this.lastProgress = 0;
    this.progress = 0;
    this.lastTime = 0;

    // positive: 1, negative: -1
    this.direction = 1;
    this._direction = 1;
  }

  reverse() {
    this.finished = false;
    this._direction = -this._direction;
    this.lastTime = 0;
  }

  update(time) {
    if (this.finished) {
      return true;
    }

    if (!this.lastTime) {
      this.lastTime = time;

      return false;
    }

    const _direction = this._direction;

    const delta = time - this.lastTime;
    const deltaProgress = delta / this.duration;

    this.lastTime = time;
    this.lastProgress = this.progress;
    this.progress += deltaProgress * this.direction * _direction;

    if ((this.progress <= 0 || this.progress >= 1)
      && ((this.times === this.repeat && _direction === 1) || (this.times === 0 && _direction === -1))) {

      this.finished = true;
      this.progress = Math.trunc(this.progress);

    } else if ((this.progress <= 0 || this.progress >= 1)) {
      this.times += Number(_direction);

      if (this.yoyo) {
        // change direction
        this.direction = -this.direction;
        this.progress = Math.trunc(this.progress) + ((this.progress % 1) * this.direction);

      } else {
        this.progress = 0 + (_direction === -1 ? 1 : 0);
      }
    }

    this.updateTransform(this.easing(this.progress), this.easing(this.lastProgress), this.target, this.params);

    return this.finished;
  }

  /* eslint-disable */
  updateTransform(progress, lastProgress, target, params) {

  }
  /* eslint-enable */
}

class Sequence extends Ticker {
  constructor(actions, repeat, yoyo) {
    super();

    this.actions = actions;
    this.repeat = repeat;
    this.yoyo = yoyo;

    this.reset();
  }
  reset() {
    this.times = 0;
    this.finished = false;
    this.position = 0;

    // positive: 1, negative: -1
    this.direction = 1;
    this._direction = 1;

    for (const action of this.actions) {
      action.reset();
    }
  }
  reverse() {
    this.finished = false;
    this._direction = -this._direction;

    for (const action of this.actions) {
      action.reverse();
    }
  }
  update(time) {
    // console.log(time)
    if (this.finished) {
      return true;
    }

    const action = this.actions[this.position];
    const finished = action.update(time);

    const _direction = this._direction;

    if (finished) {
      this.position += this.direction * _direction;

      const length = this.actions.length;

      if ((this.position < 0 || this.position >= length)
        && ((this.times === this.repeat && _direction === 1) || (this.times === 0 && _direction === -1))) {

        this.finished = true;

        return true;

      } else if (this.position < 0 || this.position >= length) {
        this.times += Number(_direction);

        if (this.yoyo) {
          // change direction
          this.direction = -this.direction;
          const maxPosition = length - 1;

          this.position = (((this.position / maxPosition) << 0) * length) + ((this.position % maxPosition) * this.direction);
          for (const action of this.actions) {
            action.reverse();
          }

        } else {
          this.position = 0 + (_direction === -1 ? length - 1 : 0);
          for (const action of this.actions) {
            action.reset();
          }
        }
      }
    }

    return false;
  }
}
class Parallel extends Ticker {
  constructor(actions, repeat, yoyo) {
    super();

    this.actions = actions;
    this.repeat = repeat;
    this.yoyo = yoyo;
    this.duration = this.actions.reduce((a, b) => Math.max(a, b.duration * (b.repeat + 1)), 0);

    this.reset();
  }
  reset() {
    this.times = 0;
    this.finished = false;
    this.startTime = 0;

    // positive: 1, negative: -1
    this.direction = 1;
    this._direction = 1;

    for (const action of this.actions) {
      action.reset();
    }
  }
  reverse() {
    this.finished = false;
    this._direction = -this._direction;
    this.startTime = 0;

    for (const action of this.actions) {
      action.reverse();
    }
  }
  update(time) {
    if (this.finished) {
      return true;
    }

    if (!this.startTime) {
      this.startTime = time;

      return false;
    }

    const _direction = this._direction;
    const direction = _direction * this.direction;

    // records of delays's accuracy: ± 1/fps ms
    let totalFinished = true;

    for (const action of this.actions) {
      let finished = false;

      if (direction > 0) {
        finished = action.update(time);
      } else {
        const passed = time - this.startTime;

        if (this.duration - passed <= action.duration * action.repeat) {
          finished = action.update(time);
        }
      }
      totalFinished = totalFinished && finished;
    }

    if (totalFinished && ((this.times === this.repeat && _direction === 1) || (this.times === 0 && _direction === -1))) {
      this.finished = true;

      return true;
    } else if (totalFinished) {
      this.times += Number(_direction);

      if (this.yoyo) {
        // change direction
        this.direction = -this.direction;
        for (const action of this.actions) {
          action.reverse();
        }
      } else {
        this.position = 0;
        for (const action of this.actions) {
          action.reset();
        }
      }
    }

    return false;
  }
}

class MoveToAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    if (!this.initialled) {
      this.x = target.x;
      this.y = target.y;
      this.initialled = true;
    }
    const { x, y } = params;
    // console.log(target.y, progress, lastProgress, deltaProgress)

    (x != null) && (target.x = this.x + ((x - this.x) * progress));
    (y != null) && (target.y = this.y + ((y - this.y) * progress));
  }
}
class MoveByAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    const deltaProgress = progress - lastProgress;
    const { x, y } = params;

    (x != null) && (target.x += x * deltaProgress);
    (y != null) && (target.y += y * deltaProgress);
  }
}
class FadeToAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    if (!this.initialled) {
      this.alpha = target.alpha;
      this.initialled = true;
    }
    target.alpha = this.alpha + ((params - this.alpha) * progress);
  }
}
class FadeByAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    const deltaProgress = progress - lastProgress;

    target.alpha += params * deltaProgress;
  }
}
class DelayAction extends AbstractAction {
  updateTransform() {
    // do nothing :)
  }
}
class RotateToAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    if (!this.initialled) {
      this.rotation = target.rotation;
      this.initialled = true;
    }
    target.rotation = this.rotation + ((params - this.rotation) * progress);
  }
}
class RotateByAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    const deltaProgress = progress - lastProgress;

    target.rotation += params * deltaProgress;
  }
}
class ScaleToAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    if (!this.initialled) {
      this.scaleX = target.scale.x;
      this.scaleY = target.scale.y;
      this.initialled = true;
    }
    const { x, y } = params;
    // console.log(target.y, progress, lastProgress, deltaProgress)

    (x != null) && (target.scale.x = this.scaleX + ((x - this.scaleX) * progress));
    (y != null) && (target.scale.y = this.scaleY + ((y - this.scaleY) * progress));
  }
}
class ScaleByAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    const deltaProgress = progress - lastProgress;
    const { x, y } = params;

    (x != null) && (target.scale.x += x * deltaProgress);
    (y != null) && (target.scale.y += y * deltaProgress);
  }
}
class ShakeAction extends AbstractAction {
  getState(_progress, offset) {
    let progress = _progress;

    let firstPart = 0;
    let secondPart = 0;
    let thirdPart = 0;
    let forthPart = 0;

    if (progress > 0.75) {
      forthPart = progress % 0.75;
      progress -= forthPart;
    }
    if (progress > 0.5) {
      thirdPart = progress % 0.5;
      progress -= thirdPart;
    }
    if (progress > 0.25) {
      secondPart = progress % 0.250001;
      progress -= secondPart;
    }
    firstPart = progress;

    return (firstPart - secondPart - thirdPart + forthPart) * offset * 4;
  }
  updateTransform(progress, lastProgress, target, params) {
    // const deltaProgress = progress - lastProgress;
    const { offsetX, offsetY } = params;

    if (!this.initialled) {
      this.lastDeltaX = 0;
      this.lastDeltaY = 0;
      this.initialled = true;
    }

    if (progress === 1 || progress === 0) {
      target.x = target.x - this.lastDeltaX;
      target.y = target.y - this.lastDeltaY;
      this.lastDeltaX = 0;
      this.lastDeltaY = 0;
    }

    if (offsetX) {
      const deltaX = this.getState(progress, offsetX);

      target.x = (target.x - this.lastDeltaX) + deltaX;
      this.lastDeltaX = deltaX;
    }
    if (offsetY) {
      const deltaY = this.getState(progress, offsetY);

      target.y = (target.y - this.lastDeltaY) + deltaY;
      this.lastDeltaY = deltaY;
    }
  }
}
class QuakeAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    const deltaProgress = progress - lastProgress;
    const { offsetX, offsetY, speed = 10 } = params;

    if (!this.initialled) {
      this.lastDeltaX = 0;
      this.lastDeltaY = 0;
      this.elapsedProgress = 0;
      this.initialled = true;
    }

    this.elapsedProgress += Math.abs(deltaProgress);

    if (this.elapsedProgress < 1 / speed && (this.progress !== 1 && this.progress !== 0)) {
      return;
    }

    this.elapsedProgress = this.elapsedProgress % (1 / speed);

    if (progress === 1 || progress === 0) {
      target.x = target.x - this.lastDeltaX;
      target.y = target.y - this.lastDeltaY;
      this.lastDeltaX = 0;
      this.lastDeltaY = 0;
      this.elapsedProgress = 0;

      return;
    }

    if (offsetX) {
      const deltaX = (Math.random() * offsetX * 2) - offsetX;

      target.x = (target.x - this.lastDeltaX) + deltaX;
      this.lastDeltaX = deltaX;
    }
    if (offsetY) {
      const deltaY = (Math.random() * offsetY * 2) - offsetY;

      target.y = (target.y - this.lastDeltaY) + deltaY;
      this.lastDeltaY = deltaY;
    }
  }
}
class SetPropertyAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    const keys = Object.keys(params);

    if (!this.initialled) {
      this.params = {};
      for (const key of keys) {
        this.params[key] = target[key];
      }
      this.initialled = true;
    }
    const deltaProgress = progress - lastProgress;

    if (deltaProgress > 0) {
      for (const key of keys) {
        target[key] = params[key];
      }
    } else {
      for (const key of keys) {
        target[key] = this.params[key];
      }
    }
  }
}
class CallbackAction extends AbstractAction {
  updateTransform(progress, lastProgress, target, params) {
    params.call(target, progress, lastProgress);
  }
}

export default function tweenGenerator(scheme, targetMap) {
  if (scheme.type === 'action') {
    let target;

    if (typeof scheme.target === 'string') {
      target = targetMap[scheme.target];
    } else {
      target = scheme.target;
    }

    const args = [target, scheme.params, scheme.duration, scheme.easing, scheme.repeat, scheme.yoyo];

    switch (scheme.name) {
      case 'moveTo': return new MoveToAction(...args);
      case 'moveBy': return new MoveByAction(...args);
      case 'delay': return new DelayAction(...args);
      case 'fadeTo': return new FadeToAction(...args);
      case 'fadeBy': return new FadeByAction(...args);
      case 'rotateTo': return new RotateToAction(...args);
      case 'rotateBy': return new RotateByAction(...args);
      case 'scaleTo': return new ScaleToAction(...args);
      case 'scaleBy': return new ScaleByAction(...args);
      case 'shake': return new ShakeAction(...args);
      case 'quake': return new QuakeAction(...args);
      case 'setProperty': return new SetPropertyAction(...args);
      case 'callback': return new CallbackAction(...args);
      default: logger.warn(`Unknown action '${scheme.name}', ignored.`);
    }
  }

  const actions = [];

  for (const action of scheme.actions) {
    actions.push(tweenGenerator(action, targetMap));
  }
  if (scheme.type === 'sequence') {
    return new Sequence(actions, scheme.repeat, scheme.yoyo);
  } else if (scheme.type === 'parallel') {
    return new Parallel(actions, scheme.repeat, scheme.yoyo);
  }

  return new Sequence([], scheme.repeat, scheme.yoyo);
}
