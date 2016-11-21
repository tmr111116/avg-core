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

import React from 'react';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import Sprite from 'classes/Sprite';

import equal from 'deep-equal';

const RawImage = createComponent('RawImage', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new Sprite();
  },
  mountNode(props) {
    const layer = this.node;
    layer.setFile(props.file).setRect(props.rect).setAnchor(props.anchor).execSync();
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    const layer = this.node;
    if (prevProps.file !== props.file || !equal(prevProps.rect, props.rect)) {
      layer.setFile(props.file).setRect(props.rect).setAnchor(props.anchor).execSync();
    }
    layer.x = props.x || 0;
    layer.y = props.y || 0;
  },

});

export const Image = React.createClass({
  displayName: 'Image',
  propTypes: {
    file: React.PropTypes.string.isRequired,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    rect: React.PropTypes.arrayOf(React.PropTypes.number),
    children: React.PropTypes.any,
  },
  render() {
    return React.createElement(RawImage, this.props, this.props.children);
  },
});

// module.exports = Image;
