/**
 * @file        A storage plugin using Localstorage
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

class Localstorage {
  constructor() {
    core.use('localstorage-init', this.init.bind(this));
  }
  async init(ctx, next) {
    core.use('save-achieve', this.save.bind(this));
    core.use('load-achieve', this.load.bind(this));
    core.use('remove-achieve', this.remove.bind(this));
    core.use('exist-achieve', this.exist.bind(this));
  }
  async save(ctx, next) {
    ctx.data = {};
    await next();
    console.log('存档上下文：', ctx);
    const localStorage = window.localStorage;
    localStorage.setItem(ctx.name, JSON.stringify(ctx.data));
  }
  async load(ctx, next) {
    const localStorage = window.localStorage;
    ctx.data = JSON.parse(localStorage.getItem(ctx.name));
    await next();
  }
  async remove(ctx, next) {
    const localStorage = window.localStorage;
    localStorage.removeItem(ctx.name);
    await next();
  }
  async exist(ctx, next) {
    const localStorage = window.localStorage;
    ctx.exist = localStorage.hasOwnProperty(ctx.name);
    await next();
  }
}

const localStorage = new Localstorage();

export default localStorage;
