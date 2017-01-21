/**
 * @file        Button component
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
import Sprite from 'classes/Sprite';
import core from 'core/core';
import pixiPropTypes from '../pixi/propTypes';
import { mountNode, updateNode } from '../pixi/properties';

const PIXI = require('pixi.js');

const RawButton = createComponent('RawButton', ContainerMixin, NodeMixin, {

  createNode() {
    this.node = new Sprite();
  },
  mountNode(props) {
    // this.setProperties(props);
    const node = this.node;

    node.buttonMode = true;
    node.on('mouseover', () => this.setFrame(1));
    node.on('mouseout', () => this.setFrame(0));
    node.on('mousedown', () => this.setFrame(2));
    node.on('mouseup', () => this.setFrame(1));
    node.on('mouseupoutside', () => this.setFrame(0));

    mountNode(node, props);
    node.texture.baseTexture.on('loaded', () => this.setFrame(0));
    this.setFrame(0);

    return node;
  },
  updateNode(prevProps, props) {
    // this.setProperties(props);
    updateNode(this.node, prevProps, props);
    this.node.texture.baseTexture.on('loaded', () => this.setFrame(0));
    this.setFrame(0);
  },
  setProperties(props) {
    const layer = this.node;

    layer.x = props.x;
    layer.y = props.y;

    if (props.anchor) {
      layer.anchor = new PIXI.Point(props.anchor[0], props.anchor[1]);
    }

    // frame: idle, hover, active
    layer.texture = core.getTexture(props.file);

    layer.texture.baseTexture.on('loaded', () => this.setFrame(0));
    this.setFrame(0);

  },
  setFrame(num) {
    const layer = this.node;

    if (!layer.texture || !layer.texture.baseTexture.hasLoaded) {
      return false;
    }

    const width = layer.texture.baseTexture.width;
    const height = layer.texture.baseTexture.height;

    const frame = new PIXI.Rectangle();

    frame.x = width * num / 3;
    frame.y = 0;
    frame.width = width / 3;
    frame.height = height;
    layer.texture.frame = frame;

    // e.stopped = true;
    return false;
  }
});

const Button = React.createClass({
  displayName: 'Button',
  propTypes: pixiPropTypes,
  render() {
    return React.createElement(RawButton, this.props, this.props.children);
  },
});

export default Button;
