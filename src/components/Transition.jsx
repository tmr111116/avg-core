/**
 * @file        Transition component
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

import React from 'react';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import TransitionContainer from 'classes/TransitionContainer';
import pixiPropTypes from './pixi/propTypes';
import { mountNode, updateNode, setValue, updateValue } from './pixi/properties';

export const Transition = createComponent('Transition', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new TransitionContainer();
  },
  mountNode(props) {
    const node = this.node;
    mountNode(node, props);
    return node;
  },
  updateNode(prevProps, props) {
    const node = this.node;
    updateNode(node, prevProps, props);
  },

});

// export const Transition = React.createClass({
//   displayName: 'Transition',
//   propTypes: pixiPropTypes,
//   render() {
//     return React.createElement(RawTransitionContainer, this.props, this.props.children);
//   },
// });
