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

import StoryScript from 'avg-storyscript';
import core from 'core/core';
import { load as loadResources } from 'classes/Preloader';
import Err from 'classes/ErrorHandler';
import fetchLocal from 'utils/fetchLocal';

/**
 *
 */
class Script {
  constructor() {

    this.parser = new StoryScript();
    this.scriptName = null;
    this.loading = true;

    core.use('storyscript-init', this.init.bind(this));
  }
  async init(ctx, next) {
    core.use('script-load', this.load.bind(this));
    core.use('script-trigger', this.trigger.bind(this));

    core.use('script-exec', async (ctx, next) => {
      const { command, flags, params } = ctx;

      if (command === 'story') {
        if (flags.includes('goto')) {
          this.script = params.name;
          await this.load({ name: params.name, autoStart: true }, next);
          // await this.beginStory();

        } else if (flags.includes('save')) {
          const name = params.name || 'default';
          await core.post('save-achieve', { name: name });

        } else if (flags.includes('load')) {
          await core.post('load-achieve', { name: name });
        }

      } else {
        await next();
      }
    });

    core.use('save-achieve', async (ctx, next) => {
      var $$scene = {
        script: this.scriptName,
        data: this.parser.getData(),
      };
      ctx.data.$$scene = $$scene;
      await next();
    });

    core.use('load-achieve', async (ctx, next) => {
      const sceneData = ctx.data.$$scene;
      await this.loadScript(sceneData.script);
      this.parser.setData(sceneData.data);
      await next();
    });

  }
  async load(ctx, next) {
    const scriptName = ctx.name;
    if (scriptName) {
      const scriptFile = `${scriptName}.bks`;
      const scriptConfig = `${scriptName}.bkc`;
      this.loading = true;
      // this.props.onLoading && this.props.onLoading();
      await core.post('script-loading');
      const task1 = fetchLocal(scriptConfig)
      .then(res => res.json())
      .then(json => loadResources(json.resources, loader => {
        return core.post('script-loading-progress', loader);
      }));
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
      Err.error('You must pass a script url');
      await next();
    }
  }
  async beginStory() {
    let ret = this.parser.next();
    while (!ret.done) {
      const context = Object.assign({}, ret.value);
      await core.post('script-exec', context);
      if (context.break) {
        break;
      }
      ret = this.parser.next();
    }
    if (ret.done) {
      Err.warn(`Script executed to end`);
    }
  }
  async trigger(ctx, next) {
    if (!this.loading) {
      this.beginStory();
    }
    await next();
  }
}

const script = new Script();

export default script;
