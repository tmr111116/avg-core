/**
 * @file        Sound commands
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
import * as SoundManager from 'classes/SoundManager';

class Sound {
  constructor() {
    core.use('sound-init', this.init.bind(this));
  }
  async init(ctx, next) {
    core.use('script-exec', this.exec.bind(this));
    core.use('save-archive', this.save.bind(this));
    core.use('load-archive', this.load.bind(this));
  }
  /**
  * @method exec
  * @private
  * @param  {object}   ctx
  * @param  {Function} next
  * @return {Promise}
  */
  async exec(ctx, next) {
    const { command, flags, params } = ctx;
    if (command === 'sound') {
      let channel = params.channel;
      if (flags.includes('bgm')) {
        channel = -1;
      } else if (flags.includes('se')) {
        channel = -2;
      } else if (flags.includes('voice')) {
        channel = -3;
      }
      const wait = flags.includes('wait');
      let promise = Promise.resolve();
      if (flags.includes('play')) {
        promise = SoundManager.play(channel);
      } else if (flags.includes('pause')) {
        promise = SoundManager.pause(channel);
      } else if (flags.includes('stop')) {
        promise = SoundManager.stop(channel);
      } else if (flags.includes('stopall')) {
        promise = SoundManager.stopAll();
      } else if (flags.includes('fade')) {
        promise = SoundManager.fade(channel, params.from, params.to, params.duration);
      } else if (flags.includes('set')) {
        promise = SoundManager.getChannel(channel)
        .then((ch) => {
          params.volume != null && ch.volume(params.volume);
          params.position != null && ch.pos(params.position);
        });
      } else {
        promise = SoundManager.setChannel(channel || 0, {
          file: params.file,
          ...params,
          // autoplay: params.autoplay,
          // loop: params.loop,
          // volume: params.volume,
          // buffer: params.buffer
        });
      }
      await (wait ? promise : Promise.resolve());
    } else {
      await next();
    }
  }
  async save(ctx, next) {

  }
  async load(ctx, next) {
    SoundManager.stopAll();
  }
}

/**
 * [sound description]
 * @export
 * @type {Sound}
 */
const sound = new Sound();

export default sound;
