/**
 * @file        Layer component
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
import PixiLayer from 'classes/Layer';
const PIXI = require('pixi.js');

const RawLayer = createComponent('RawLayer', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new PixiLayer();
  },
  mountNode(props) {
    // color, opacity, width, height, x, y, etc.
    const layer = this.node;
    layer.setProperties(props);
    //  layer.x = props.x || 0;
    //  layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    const layer = this.node;
    layer.setProperties(props);
  },
});

export const Layer = React.createClass({
  displayName: 'Layer',
  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    opacity: React.PropTypes.number,
    visible: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    fillColor: React.PropTypes.number,
    fillAlpha: React.PropTypes.number,
    anchor: React.PropTypes.arrayOf(React.PropTypes.number),
    children: React.PropTypes.any,
  },
  render() {
    const props = {
      width: PIXI.currentRenderer.width,
      height: PIXI.currentRenderer.height,
      ...this.props,
    };
    return React.createElement(RawLayer, props, this.props.children);
  },
});

// module.exports = Layer;
