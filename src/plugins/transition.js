/**
 * @file        Plugin to enable transition to node.
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
import { CrossFadeFilter } from 'classes/Transition/Filters';
import { TransitionFilter } from 'classes/Transition/TransitionFilter';
import { TransitionPlugin as installPlugin } from 'classes/Transition/TransitionPlugin';
import Logger from 'utils/logger';

const PIXI = require('pixi.js');

const logger = Logger.create('Transition Plugin');

export default class TransitionPlugin {
  constructor(node, method) {
    try {
      this.node = node._reactInternalInstance._renderedComponent.node;
    } catch (e) {
      this.node = node;
    }
    this.method = method;
    this.clickCallback = false;
    this.unskippable = false;

    let hasTransFilter = false;
    for (let filter of (this.node.filters || [])) {
      if (filter instanceof TransitionFilter) {
        hasTransFilter = true;
        break;
      }
    }
    if (!hasTransFilter) {
      this.node.filters = this.node.filters || [];
      this.node.filters = [...this.node.filters, new TransitionFilter()];
      installPlugin(this.node);
      logger.debug('not installed');
    }

    core.use('script-trigger', async (ctx, next) => {
      if (this.clickCallback && !this.unskippable) {
        this.node.completeTransition();
        this.clickCallback = false;
        this.unskippable = false;
      } else {
        await next();
      }
    });
  }
  static wrap(node, method) {
    const wrapped = new TransitionPlugin(node, method);
    return wrapped.process.bind(wrapped);
  }
  async process(ctx, next) {
    const layer = this.node;
    const method = this.method;

    const { flags, params, command } = ctx;

    const isSkip = flags.includes('_skip_');

    if (flags.includes('pretrans')) {
      const renderer = core.getRenderer();
      if (layer.transitionStatus !== 'prepare') {
        layer.transitionStatus = 'prepare';
        layer.prepareTransition(renderer);
      }
      return method(ctx, next);
    } else if (flags.includes('trans') || params.trans) {
      params.trans = params.trans || 'crossfade';
      const renderer = core.getRenderer();
      if (layer.transitionStatus !== 'prepare') {
        layer.transitionStatus = 'prepare';
        layer.prepareTransition(renderer);
      }
      await method(ctx, next);
      layer.transitionStatus = 'start';
      const promise = layer.startTransition(renderer, new CrossFadeFilter(params.duration))
        .then(() => layer.transitionStatus = null);

      this.clickCallback = true;

      if (flags.includes('unskippable')) {
        this.unskippable = true;
      }

      // FIXME
      if (layer.visible && !flags.includes('nowait') && !isSkip) {
        await promise;
      }

      if (isSkip) {
        layer.completeTransition();
      }

      this.clickCallback = false;

    } else {
      return method(ctx, next);
    }
  }
}
