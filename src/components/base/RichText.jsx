/**
 * @file        General image component
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

import componentify from '../pixi/componentify';
import { mountNode, updateNode, setValue, updateValue } from '../pixi/properties';
import RichTextNode from 'pixi-richtext';

export const RichText =  componentify('RichText', {

  createNode() {
    this.node = new RichTextNode();
  },
  mountNode(props) {
    const node = this.node;

    setValue.call(node, 'style', props.style);
    setValue.call(node, 'layout', props.layout);
    setValue.call(node, 'text', props.text);
    mountNode(node, props);

    return node;
  },
  updateNode(prevProps, props) {
    const node = this.node;

    updateValue.call(node, 'style', prevProps.style, props.style);
    updateValue.call(node, 'layout', prevProps.layout, props.layout);
    updateValue.call(node, 'text', prevProps.text, props.text);
    updateNode(node, prevProps, props);
  },

});
