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

const PIXI = require('pixi.js');

export default function tweenGenerator(scheme, targetMap) {
  if (scheme.type === 'action') {
    let target;
    if (typeof scheme.target === 'string') {
      target = targetMap[scheme.target];
    } else {
      target = scheme.target;
    }
    return new MoveToAction(target, scheme.params, scheme.duration, scheme.easing, scheme.repeat, scheme.yoyo);
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

class Ticker {
  constructor() {
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

    if ((this.progress <= 0 || this.progress >= 1) && ((this.times === this.repeat && _direction === 1) || (this.times === 0 && _direction === -1))) {
      this.finished = true;
      this.progress = this.progress << 0;
    } else if ((this.progress <= 0 || this.progress >= 1)) {
      this.times += 1 * _direction;

      if (this.yoyo) {
        // change direction
        this.direction = -this.direction;
        this.progress = (this.progress << 0) + (this.progress % 1) * this.direction;
      } else {
        this.progress = 0 + (_direction === -1 ? 1 : 0);
      }
    }

    this.updateTransform(this.easing(this.progress), this.easing(this.lastProgress), this.target, this.params);

    return this.finished;
  }

  updateTransform(progress, lastProgress, target, params) {

  }

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

      if ((this.position < 0 || this.position >= length) && ((this.times === this.repeat && _direction === 1) || (this.times === 0 && _direction === -1))) {
        this.finished = true;
        return true;
      } else if (this.position < 0 || this.position >= length) {
        this.times += 1 * _direction;

        if (this.yoyo) {
          // change direction
          this.direction = -this.direction;
          const maxPosition = length - 1;
          this.position = ((this.position / maxPosition) << 0) * length + (this.position % maxPosition) * this.direction;
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
      this.times += 1 * _direction;

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
    const deltaProgress = progress - lastProgress;
    const { x, y } = params;
    // console.log(target.y, progress, lastProgress, deltaProgress)
    target.x = this.x + (x - this.x) * progress;
    target.y = this.y + (y - this.y) * progress;
  }
}
