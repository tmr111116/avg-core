/**
 * @file        Container component
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
import PixiContainer from 'classes/Sprite';
import pixiPropTypes from './pixi/propTypes';

const RawContainer = createComponent('RawContainer', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new PixiContainer();
  },
  mountNode(props) {
    // color, opacity, width, height, x, y, etc.
    const layer = this.node;
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    layer.alpha = props.opactiy || 1;
    return layer;
  },
  updateNode(prevProps, props) {
    const layer = this.node;
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    layer.alpha = props.opactiy || 1;
  },

});

export const Container = React.createClass({
  displayName: 'Container',
  propTypes: pixiPropTypes,
  render() {
    return React.createElement(RawContainer, this.props, this.props.children);
  },
});

// module.exports = Container;
