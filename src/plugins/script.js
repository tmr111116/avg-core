/**
 * @file        Script plugin
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

import StoryScript from 'avg-storyscript/index';
import parser from 'avg-storyscript/libs/parser';
import { InsertedBlock } from 'avg-storyscript/libs/block';
import core from 'core/core';
import fetchLocal from 'utils/fetchLocal';

const logger = core.getLogger('Script Plugin');

// utils
function getTimeoutPromise(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

/**
 *
 */
class Script {
  constructor() {

    this.parser = new StoryScript(this.handleGlobalChanged.bind(this));
    this.macros = {};
    this.macroKeys = [];
    this.scriptName = null;
    this.loading = false;
    this.waiting = false;

    this.isSkip = false;
    this.isAuto = false;
    this.autoInterval = 1000;

    core.use('storyscript-init', this.init.bind(this));
  }
  async init() {
    core.use('script-load', this.load.bind(this));
    core.use('script-trigger', this.trigger.bind(this));

    // add macros
    core.use('script-addmacro', async (ctx, next) => {
      const macros = ctx.macros || {};

      Object.assign(this.macros, macros);
      this.macroKeys = Object.keys(this.macros);
    });

    // handle macros
    core.use('script-exec', async (ctx, next) => {
      await next();
      const { command, flags, params } = ctx;

      if (this.macroKeys.includes(command)) {
        const macroData = this.macros[command](flags, params);

        const ss = this.parser;

        if (typeof macroData === 'string') {
          ss.BLOCKSTACK.push(ss.CURRENTBLOCK);
          const blockData = parser.parse(macroData);
          const block = new InsertedBlock(blockData);

          ss.CURRENTBLOCK = block;
        } else {
          ss.BLOCKSTACK.push(ss.CURRENTBLOCK);
          const blockData = macroData;
          const block = new InsertedBlock(blockData);

          ss.CURRENTBLOCK = block;
        }
      }
    });

    // listen script execute
    core.use('script-exec', async (ctx, next) => {
      const { command, flags, params } = ctx;

      if (command === 'story') {
        if (flags.includes('goto')) {
          this.script = params.name;
          await this.load({ name: params.name, autoStart: true }, next);
          // await this.beginStory();
        } else if (flags.includes('save')) {
          const name = params.name || 'default';
          const extra = Object.assign({}, params);

          delete extra.name;
          await core.post('save-archive', { name, extra });
        } else if (flags.includes('load')) {
          const name = params.name || 'default';

          await core.post('load-archive', { name });
        } else if (flags.includes('mode')) {
          this.isAuto = false;
          this.isSkip = false;
          if (flags.includes('auto')) {
            this.autoInterval = params.interval || this.autoInterval;
            this.isAuto = true;
          } else if (flags.includes('skip')) {
            this.isSkip = true;
          } else if (flags.includes('normal')) {
            // do nothing
          }
        }
      } else {
        await next();
      }
    });

    core.use('script-set-autointerval', async ctx => {
      this.autoInterval = ctx.autoInterval || this.autoInterval;
    });
    core.use('script-get-autointerval', async ctx => {
      ctx.autoInterval = this.autoInterval;

      return this.autoInterval;
    });
    core.use('script-mode', async ctx => {
      this.isAuto = false;
      this.isSkip = false;
      if (ctx.mode === 'auto') {
        this.isAuto = true;
        core.post('script-trigger', { DONOTSTOPAUTOORSKIP: true });
      } else if (ctx.mode === 'skip') {
        this.isSkip = true;
        core.post('script-trigger', { DONOTSTOPAUTOORSKIP: true });
      } else {
        core.post('script-trigger', { DONOTSTOPAUTOORSKIP: false });
      }
    });

    // listen archive saving
    core.use('save-archive', async (ctx, next) => {
      // const { blocks, saveScope } = this.parser.getData();
      const blocks = this.parser.getBlockData();
      const saveScope = this.parser.getSaveScope();
      const $$scene = {
        script: this.scriptName,
        blocks,
        saveScope,
        autoInterval: this.autoInterval,
      };

      ctx.data.$$scene = $$scene;
      // ctx.globalData.$$scene = { globalScope };
      await next();
    });

    // listen archive loading
    core.use('load-archive', async (ctx, next) => {
      const { script, blocks, saveScope, autoInterval } = ctx.data.$$scene;

      await this.load({ name: script, autoStart: false }, () => {});
      this.parser.setSaveScope(saveScope);
      this.parser.setBlockData(blocks);
      this.autoInterval = autoInterval;
      await next();
    });

    // restore global variables
    const g = {};

    await core.post('load-global', g);
    g.globalData.$$scene = g.globalData.$$scene || {};
    this.parser.setGlobalScope(g.globalData.$$scene.globalScope || {});

    // save global variables once any of them changed
    core.use('save-global', async (ctx, next) => {
      const globalScope = this.parser.getGlobalScope();

      ctx.globalData.$$scene = { globalScope };
      await next();
    });
  }

  handleGlobalChanged() {
    const g = {};

    core.post('save-global', g);
  }
  async load(ctx, next) {
    const scriptName = ctx.name;

    if (scriptName) {
      const assetsPath = core.getAssetsPath();
      const scriptFile = `${assetsPath}${scriptName}.bks`;
      const scriptConfig = `${assetsPath}${scriptName}.bkc`;

      this.loading = true;
      // this.props.onLoading && this.props.onLoading();
      await core.post('script-loading');
      const task1 = fetchLocal(scriptConfig)
      .then(res => res.json())
      .then(json => core.loadAssets(json.resources, loader => core.post('script-loading-progress', loader)))
      .catch(() => {});
      const task2 = fetchLocal(scriptFile)
      .then(res => res.text())
      .then(text => this.parser.load(text.trim()));

      await Promise.all([task1, task2]);

      this.scriptName = scriptName;

      // this.props.onLoadingComplete && this.props.onLoadingComplete();
      await core.post('script-loaded');
      this.loading = false;

      await next();

      if (ctx.autoStart) {
        this.beginStory();
      }

    } else {
      logger.error('You must pass a script url');
      await next();
    }
  }
  async beginStory() {
    let ret = this.parser.next();

    while (!ret.done) {
      const context = Object.assign({}, ret.value);

      if (this.isSkip) {
        context.flags.push('_skip_');
      }

      if (this.isAuto) {
        context.flags.push('_auto_');
      }

      this.waiting = true;
      await core.post('script-exec', context);
      this.waiting = false;

      if (context.break && this.isAuto) {

        await getTimeoutPromise(this.autoInterval);

        return core.post('script-trigger', { DONOTSTOPAUTOORSKIP: true });

      } else if (context.break && this.isSkip) {

        // avoid executing to the end directly...
        await getTimeoutPromise(80);

        return core.post('script-trigger', { DONOTSTOPAUTOORSKIP: true });

      } else if (context.break) {
        break;
      }
      ret = this.parser.next();
    }
    if (ret.done) {
      this.isAuto = false;
      this.isSkip = false;
      logger.info(`Script executed to end.`);
    }

    return Promise.resolve();
  }
  async trigger(ctx, next) {
    await next();
    if (!this.loading) {
      if (!ctx.DONOTSTOPAUTOORSKIP) {
        this.isAuto = false;
        this.isSkip = false;
      }
      !this.waiting && this.beginStory();
    }
  }
}

const script = new Script();

export default script;
