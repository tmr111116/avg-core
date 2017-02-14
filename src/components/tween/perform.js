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

import core from 'core/core';
import Logger from 'core/logger';

const logger = Logger.create('Tween');

class Ticker {
  constructor() {
    const ticker = core.ticker;

    this._update = () => {
      this.update(ticker.elapsedTime);
    };
  }
  start() {
    core.getTicker().add(this._update);
  }
  stop() {
    core.getTicker().remove(this._update);
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

  update(time, autoFinish = true) {
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

    // avoid Infinity caused by small duration value.
    this.progress = isFinite(this.progress) ? this.progress : Math.sign(this.progress);

    if ((this.progress <= 0 || this.progress >= 1)
      && ((this.times === this.repeat && _direction === 1) || (this.times === 0 && _direction === -1))) {

      autoFinish && (this.finished = true);
      this.progress = Math.max(0, Math.min(this.progress, 1));

    } else if ((this.progress <= 0 || this.progress >= 1)) {
      this.times += Number(_direction);

      if (this.yoyo) {
        // change direction
        this.direction = -this.direction;
        this.progress = Math.max(0, Math.min(this.progress, 1)) + ((this.progress - (this.progress << 0)) * this.direction);

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
      this.lastDeltaX = 0;
      this.lastDeltaY = 0;
      this.initialled = true;
    }
    const { x = target.x, y = target.y } = params;

    if (progress === 0) {
      target.x = target.x - this.lastDeltaX;
      target.y = target.y - this.lastDeltaY;
      this.lastDeltaX = 0;
      this.lastDeltaY = 0;

      return;
    }

    if (progress === 1) {
      this.lastDeltaX = x - target.x + this.lastDeltaX;
      this.lastDeltaY = y - target.y + this.lastDeltaY;
      target.x = x;
      target.y = y;

      return;
    }

    if (x != null) {
      target.x -= this.lastDeltaX;

      const deltaX = (x - target.x) * progress;

      target.x += deltaX;

      this.lastDeltaX = deltaX;
    }
    if (y != null) {
      target.y -= this.lastDeltaY;

      const deltaY = (y - target.y) * progress;

      target.y += deltaY;

      this.lastDeltaY = deltaY;
    }
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
      this.lastDeltaAlpha = 0;
      this.initialled = true;
    }

    const alpha = params;

    if (progress === 0) {
      target.alpha = target.alpha - this.lastDeltaAlpha;
      this.lastDeltaAlpha = 0;

      return;
    }

    if (progress === 1) {
      this.lastDeltaAlpha = alpha - target.alpha + this.lastDeltaAlpha;
      target.alpha = alpha;

      return;
    }

    target.alpha -= this.lastDeltaAlpha;
    const deltaAlpha = (alpha - target.alpha) * progress;

    target.alpha += deltaAlpha;
    this.lastDeltaAlpha = deltaAlpha;
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
      this.lastDeltaRotation = 0;
      this.initialled = true;
    }

    const rotation = params;

    if (progress === 0) {
      target.rotation = target.rotation - this.lastDeltaRotation;
      this.lastDeltaRotation = 0;

      return;
    }

    if (progress === 1) {
      this.lastDeltaRotation = rotation - target.rotation + this.lastDeltaRotation;
      target.rotation = rotation;

      return;
    }

    target.rotation -= this.lastDeltaRotation;
    const deltaAlpha = (rotation - target.rotation) * progress;

    target.rotation += deltaAlpha;
    this.lastDeltaRotation = deltaAlpha;
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
      this.lastDeltaScaleX = 0;
      this.lastDeltaScaleY = 0;
      this.initialled = true;
    }

    const { x = target.scale.x, y = target.scale.y } = params;

    if (progress === 0) {
      target.scale.x = target.scale.x - this.lastDeltaScaleX;
      target.scale.y = target.scale.y - this.lastDeltaScaleY;
      this.lastDeltaScaleX = 0;
      this.lastDeltaScaleY = 0;

      return;
    }

    if (progress === 1) {
      this.lastDeltaScaleX = x - target.scale.x + this.lastDeltaScaleX;
      this.lastDeltaScaleY = y - target.scale.y + this.lastDeltaScaleY;
      target.scale.x = x;
      target.scale.y = y;

      return;
    }

    if (x != null) {
      target.scale.x -= this.lastDeltaScaleX;

      const deltaX = (x - target.scale.x) * progress;

      target.scale.x += deltaX;

      this.lastDeltaScaleX = deltaX;
    }
    if (y != null) {
      target.scale.y -= this.lastDeltaScaleY;

      const deltaY = (y - target.scale.y) * progress;

      target.scale.y += deltaY;

      this.lastDeltaScaleY = deltaY;
    }
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
  constructor(...args) {
    super(...args);

    /**
     * autoFinish is designed to control whether a action should be setting to `finished`
     * when after the specific `duration`.
     *
     * So, if duration was setting to 0 or undefined, `autoFinish` should be `false`,
     * thus a callback `() => (this.finished = true)` must be passed to users
     * so that they can finish it by themselves.
     */
    if (this.duration) {
      this.autoFinish = true;
    } else {
      this.autoFinish = false;
    }
  }
  update(time) {
    return super.update(time, this.autoFinish);
  }
  updateTransform(progress, lastProgress, target, params) {
    params.call(target, progress, lastProgress, target, () => (this.finished = true));
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
