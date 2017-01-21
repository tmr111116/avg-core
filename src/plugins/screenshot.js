/**
 * @file        Screen shot signals
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

function resizeImage(dataurl, width, height) {
  const sourceImage = new Image();

  return new Promise(resolve => {
    sourceImage.onload = function () {
      // Create a canvas with the desired dimensions
      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      // Scale and draw the source image to the canvas
      canvas.getContext('2d').drawImage(sourceImage, 0, 0, width, height);

      // Convert the canvas to a data URL in PNG format
      resolve(canvas.toDataURL());
    };
    sourceImage.src = dataurl;
  });
}

class Screenshot {
  constructor() {
    this.initialed = false;

    this.store = {};

    core.use('screenshot-init', this.init.bind(this));
  }
  async init() {
    if (!this.initialed) {
      core.use('screenshot-shot', this.shot.bind(this));
      core.use('screenshot-get', this.get.bind(this));
      this.initialed = true;
    }
  }

  /**
  * Supply screenshot signals
  * Shot current screen to a texture and pass it through `ctx`.
  *
  * @event shot
  * @async
  * @param  {object}   ctx  middleware context
  * @param  {string}   [ctx.type='base64']  type of returned data, 'base64', 'canvas', 'image', 'pixels'
  * @param  {number}   [ctx.width]  width of screen shot, default to current screen width
  * @param  {number}   [ctx.height]  height of screen shot, default to current screen height
  * @param  {Function} next execute next middleware
  */
  async shot(ctx, next) {
    const renderer = core.getRenderer();

    const width = ctx.width || renderer.width;
    const height = ctx.height || renderer.height;

    // const targetTexture = PIXI.RenderTexture.create(width, height);
    // const CONTEXT_UID = renderer.CONTEXT_UID;
    // targetTexture.baseTexture._glRenderTargets[CONTEXT_UID] = {
    //   resolution: renderer.resolution
    // };

    // TODO: renderer.extract seems to have bugs, now using a custom implementation;
    let base64;

    if (ctx.type === 'canvas') {
      base64 = renderer.extract.canvas();
    } else if (ctx.type === 'image') {
      base64 = renderer.extract.image();
    } else if (ctx.type === 'pixels') {
      base64 = renderer.extract.pixels();
    } else {
      base64 = renderer.extract.base64(window.stage);
    }

    ctx.data = await resizeImage(base64, width, height);

    const name = ctx.name || 'default';

    this.store[name] = ctx.data;

    await next();
  }

  async get(ctx, next) {
    const name = ctx.name || 'default';

    ctx.data = this.store[name];

    await next();
  }
}

const screenshot = new Screenshot();

export default screenshot;
