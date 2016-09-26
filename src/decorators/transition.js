/**
 * @file        Decorator to enable transition to node.
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

import { CrossFadeFilter } from 'classes/Transition/Filters';

export function transition(target, name, descriptor) {
  let method = descriptor.value;
  descriptor.value = async function(params, flags, name) {
    let node = this.node;
    let layer;
    try {
      layer = node._reactInternalInstance._renderedComponent.node;
    } catch (e) {
      layer = node;
    }

    if (flags.includes('pretrans')) {
      let renderer = PIXI.currentRenderer;
      if (layer._transitionStatus !== 'prepare') {
        layer._transitionStatus = 'prepare';
        layer.prepareTransition(renderer);
      }
      return method.call(this, params, flags, name);
    } else if (flags.includes('trans') || params.trans) {
      params.trans = params.trans || 'crossfade';
      let renderer = PIXI.currentRenderer;
      if (layer._transitionStatus !== 'prepare') {
        layer._transitionStatus = 'prepare';
        layer.prepareTransition(renderer);
      }
      let { promise, ...otherRets } = method.call(this, params, flags, name);
      await promise;
      layer._transitionStatus = 'start';
      promise = layer.startTransition(renderer, new CrossFadeFilter(params.duration))
        .then(() => layer._transitionStatus = null);
      const clickCallback = layer.completeTransition.bind(layer);
      return { promise, ...otherRets, clickCallback };
    } else {
      return method.call(this, params, flags, name);
    }
  }
}
