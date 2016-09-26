/**
 * @file        General text component
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
import TextSprite from 'classes/TextSprite';

const RawText = createComponent('RawText', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new TextSprite();
  },
  mountNode(props) {
    const layer = this.node;
    const options = {
      color: 0xffffff,
      size: 24,
      font: 'sans-serif',
      width: -1,
      height: -1,
      xinterval: 0,
      yinterval: 3,
      extrachar: '...',
      bold: false,
      italic: false,
      strike: false,
      under: false,
      shadow: false,
      shadowcolor: 0x0,
      stroke: false,
      strokecolor: 0x0,
      ...props,
    };
    layer.setText(props.text || props.children || '').setAnchor(options.anchor)
    .setColor(options.color).setSize(options.size)
    .setFont(options.font)
    .setTextWidth(options.width)
    .setTextHeight(options.height)
    .setXInterval(options.xinterval)
    .setYInterval(options.yinterval)
    .setExtraChar(options.extrachar)
    .setBold(options.bold)
    .setItalic(options.italic)
    /* .setStrike(strike).setUnder(under) */
    .setShadow(options.shadow)
    .setShadowColor(options.shadowcolor)
    .setStroke(options.stroke)
    .setStrokeColor(options.strokecolor)
    .exec();
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    this.node.text = props.text || props.children || '';
    this.node.x = props.x || 0;
    this.node.y = props.y || 0;
    const options = {
      color: 0xffffff,
      size: 24,
      font: 'sans-serif',
      width: -1,
      height: -1,
      xinterval: 0,
      yinterval: 3,
      extrachar: '...',
      bold: false,
      italic: false,
      strike: false,
      under: false,
      shadow: false,
      shadowcolor: 0x0,
      stroke: false,
      strokecolor: 0x0,
      ...props,
    };
    this.node.setAnchor(options.anchor).setColor(options.color).setSize(options.size)
    .setFont(options.font)
    .setTextWidth(options.width)
    .setTextHeight(options.height)
    .setXInterval(options.xinterval)
    .setYInterval(options.yinterval)
    .setExtraChar(options.extrachar)
    .setBold(options.bold)
    .setItalic(options.italic)
    /* .setStrike(strike).setUnder(under) */
    .setShadow(options.shadow)
    .setShadowColor(options.shadowcolor)
    .setStroke(options.stroke)
    .setStrokeColor(options.strokecolor)
    .exec();
  },

});

export class Text extends React.Component {
  static displayName = 'Text';
  static propTypes = {
    text: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    children: React.PropTypes.any,
  }
  render() {
    return React.createElement(RawText, this.props, this.props.children);
  }
}

// module.exports = Text;
