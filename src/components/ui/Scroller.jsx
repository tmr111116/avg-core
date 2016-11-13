/**
 * @file        Scroller component
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
const PIXI = require('pixi.js');

const RawScroller = createComponent('RawScroller', ContainerMixin, NodeMixin, {

  createNode(element) {
    // this.node = new PixiLayer();
    this.node = new PIXI.Graphics();
    const button = new PIXI.Graphics();
    this.node.addChild(button);
  },
  mountNode(props) {
    this.setProperties(props);
    const layer = this.node;
    return layer;
  },
  updateNode(prevProps, props) {
    this.setProperties(props);
  },
  setProperties(props) {
    const p = {
      backgroundWidth: props.backgroundWidth || 10,
      backgroundHeight: props.backgroundHeight || 10,
      direction: props.direction || 'vertical',
      backgroundColor: (typeof props.backgroundColor === 'number') ? props.backgroundColor : 0xffffff,
      backgroundAlpha: (typeof props.backgroundAlpha === 'number') ? props.backgroundAlpha : 1,
      x: props.x || 0,
      y: props.y || 0,
      visible: (typeof props.visible === 'boolean') ? props.visible : true,

      buttonWidth: props.buttonWidth || 10,
      buttonColor: (typeof props.buttonColor === 'number') ? props.buttonColor : 0xffffff,
      buttonAlpha: (typeof props.buttonAlpha === 'number') ? props.buttonAlpha : 1,
      buttonLength: props.buttonLength || 10,
      buttonPosition: props.buttonPosition || 0,
    }
    const layer = this.node;
    layer.clear();
    layer.beginFill(p.backgroundColor, p.backgroundAlpha);
    layer.drawRect(0, 0, p.backgroundWidth, p.backgroundHeight);
    layer.endFill();
    layer.x = p.x;
    layer.y = p.y;
    layer.visible = p.visible;

    const button = this.node.children[0];
    button.clear();
    button.beginFill(p.buttonColor, p.buttonAlpha);

    if (p.direction === 'vertical') {
      button.drawRect(0, 0, p.buttonWidth, p.buttonLength);
    } else {
      button.drawRect(0, 0, p.buttonLength, p.buttonWidth);
    }
    button.endFill();

    if (p.direction === 'vertical') {
      button.x = (p.backgroundWidth - p.buttonWidth) / 2;
      button.y = (p.backgroundHeight - p.buttonLength) * p.buttonPosition;
    } else {
      button.y = (p.backgroundHeight - p.buttonWidth) / 2;
      button.x = (p.backgroundWidth - p.buttonLength) * p.buttonPosition;
    }

  }
});

export const Scroller = React.createClass({
  displayName: 'Scroller',
  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    visible: React.PropTypes.bool,
    children: React.PropTypes.any,
  },
  render() {
    return React.createElement(RawScroller, this.props, this.props.children);
  },
});

// module.exports = Layer;
