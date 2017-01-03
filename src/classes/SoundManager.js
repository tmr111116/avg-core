/**
 * @file        Sound manager
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

import Logger from 'utils/logger';

const Howler = require('howler');

const logger = Logger.create('SoundManager');

/* By default, audio on iOS is locked until a sound is played within a user interaction,
* and then it plays normally the rest of the page session (Apple documentation).
* The default behavior of howler.js is to attempt to silently unlock audio playback by
* playing an empty buffer on the first touchend event.
* This behavior can be disabled by calling:
*/
Howler.iOSAutoEnable = false;

let Channels = [],
  Resolve = [];

export function getChannel(index) {
  return new Promise((resolve, reject) => {
    const ch = Channels[index];
    if (ch)
      resolve(ch);
    else {
      logger.error(`Channel ${ch} hasn't been initialed. Call .load() first.`);
      reject();
    }
  });
}

export function setChannel(index, options) {
  return new Promise((resolve, reject) => {
    if (!options.file) {
      logger.error('File needed in option');
    }

    options = Object.assign({
      autoplay: true,
      buffer: false,
      loop: true,
      volume: 1,
      onEnd: () => {},
      onPlay: () => {},
      onLoad: () => {},
    }, options);

    let ch = Channels[index];
    if (ch) {
      ch.stop();
      ch.unload();
      Channels[index] = ch = null;
    }
    Channels[index] = ch = new Howler.Howl({
      urls: (options.file instanceof Array) ? options.file : [options.file],
      autoplay: options.autoplay,
      buffer: options.buffer,
      loop: options.loop,
      volume: options.volume,
      onend: () => {
        if (Resolve[index]) {
          Resolve[index]();
          Resolve[index] = null;
        }
        options.onEnd && options.onEnd();
      },   // 如何处理？
      onplay: options.onPlay, // 如何处理？ waitButton
      onload: () => {
        resolve(ch);
      },
    });
  });
}

// methods
export function setVolume(channel, value) {    // value区间0-1
  return getChannel(channel)
    .then(ch => ch.volume(value));
}
export function setPosition(channel, value) {  // value单位是秒
  return getChannel(channel)
    .then(ch => ch.pos(value));
}
export function play(channel) {
  return getChannel(channel)
    .then((ch) => {
      ch.play();
      ch.m_status = 'play';
    });
}

export function pause(channel) {
  return getChannel(channel)
    .then((ch) => {
      ch.pause();
      ch.m_status = (ch.m_status === 'pause') ? 'play' : 'pause';
    });
}
export function stop(channel) {
  return getChannel(channel)
    .then((ch) => {
      ch.stop();
      ch.unload();
    });
}
export function fade(channel, from, to, duration, cb) {
  return getChannel(channel)
    .then((ch) => {
      from != null && ch.volume(from);
      if (ch.m_status !== 'play') {
        ch.play();
      }
      if (cb) {
        ch.fade(ch.volume(), to, duration, cb);
      } else {
        return new Promise((resolve, reject) => {
          ch.fade(ch.volume(), to, duration, resolve);
        });
      }
    });
}
export function stopAll() {
  if (Channels.length)
    for (const ch of Channels) {
      ch.stop();
      ch.unload();
    }
}
export function state(channel) {
  return getChannel(channel)
    .then((ch) => {
      return ch.m_status;
    });
}
export function wait(channel) {
  return new Promise((resolve, reject) => {
    Resolve[channel] = resolve;
  });
}
