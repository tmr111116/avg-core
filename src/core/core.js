/**
 * @file        core
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

import compose from 'koa-compose';
import FontFaceObserver from 'fontfaceobserver';
import { render as renderReact } from 'react-dom';
import Container from 'classes/Container';
import { attachToSprite } from 'classes/EventManager';
import sayHello from 'utils/sayHello';

const PIXI = require('pixi.js');

/**
 * Core of AVG.js, you can start your game development from here.
 *
 * @class
 * @memberof AVG
 */
class Core {
  constructor() {

    /**
     * @type {Boolean}
     * @private
     * @readonly
     */
    this._init = false;

    this.renderer = null;
    this.stage = null;
    this.canvas = null;

    /**
     * Currently used middleware
     * @member {object<string, function[]>}
     * @default {}
     * @private
     */
    this.middlewares = {};

  }

  /**
   * install a middleware.
   *
   * @param {string} name signal name
   * @param {function} middleware instance of middleware
   * @see AVG.core.Middleware
   */
  use(name, middleware) {
    let middlewares;
    if (!this.middlewares[name]) {
      middlewares = [];
      this.middlewares[name] = middlewares;
    } else {
      middlewares = this.middlewares[name];
    }
    middlewares.push(middleware);
  }

  /**
   * uninstall a middleware.
   *
   * @param {string} name signal name
   * @param {function} middleware instance of middleware
   * @see AVG.core.Middleware
   */
  unuse(name, middleware) {
    const middlewares = this.middlewares[name];
    if (middlewares) {
      const pos = middlewares.indexOf(middleware);
      if (pos !== -1) {
        middlewares.splice(pos, 1);
      } else {
        console.warn(`Do not find the given middleware in ${name}.`);
      }
    } else {
      console.warn(`Do not find the given middleware in ${name}.`);
    }
  }

  /**
   * send a signal to core
   *
   * @param {string} name signal name
   * @param {object} [context={}] context to process
   * @return {promise}
   */
  post(name, context, next) {
    const middlewares = this.middlewares[name];
    if (middlewares) {
      return compose(middlewares)(context || {}, next);
    }
    return Promise.resolve();
  }

  /**
   * Initial AVG.js core functions
   * 
   * @param {number} width width of screen
   * @param {number} height height of screen
   * @param {object} [options]
   * @param {HTMLCanvasElement} [options.view] custom canvas element
   * @param {string|array<string>} [options.fontFamily] load custom web-font
   */
  async init(width, height, options = {}) {
    if (options.fontFamily) {
      const font = new FontFaceObserver('Demo_font');
      await font.load();
    }

    /* create PIXI renderer */


    this.renderer = new PIXI.WebGLRenderer(width, height, {
      view: options.view,
      autoResize: true,
      roundPixels: true,
    });
    PIXI.currentRenderer = this.renderer;
    this.stage = new Container();
    attachToSprite(this.stage);
    this.stage._ontap = e => this.post('tap', e);
    this.stage._onclick = e => this.post('click', e);

    sayHello();
    this._init = true;
  }

  getRenderer() {
    if (this._init) {
      return this.renderer;
    }
    console.error('[Hasn\'t initialed.]');
    return null;
  }
  getStage() {
    if (this._init) {
      return this.stage;
    }
    console.error('[Hasn\'t initialed.]');
    return null;
  }

  /**
   * render surface to page.
   *
   * @param {React.Component} component
   * @param {HTMLDOMElement} target
   * @return {Promise}
   */
  async render(component, target) {
    if (!this._init) {
      throw 'not initialed';
    }
    return new Promise(function(resolve, reject) {
      renderReact(component, target, resolve);
    }).then(() => {
      target.appendChild(this.renderer.view);
    });
  }
}

/**
 * @export
 * @type {Core}
 */
const core = new Core();
// Object.freeze(core);

export default core;
