/**
 * @file        Dialog component
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
import ReactDOM from 'react-dom';
const PIXI = require('pixi.js');
import { Layer } from '../Layer';
import { Image } from '../Image';
import combineProps from 'utils/combineProps';

export default class Layout extends React.Component {
  static propTypes = {
    ...Layer.propTypes,
    padding: React.PropTypes.arrayOf(React.PropTypes.number),
    direction: React.PropTypes.string,
    baseline: React.PropTypes.number,
    interval: React.PropTypes.number,
    children: React.PropTypes.any,
  }
  static defaultProps = {
    x: 0,
    y: 0,
    padding: [0, 0, 0, 0],
    interval: 10,
    direction: 'vertical',
  }
  state = {
    width: null,
    height: null,
  }
  componentDidMount() {
    let maxWidth = 0;
    let maxHeight = 0;
    const refs = Object.keys(this.refs);
    let count = refs.length;
    for (let ref of refs) {
      const child = this.refs[ref];
      const node = child._reactInternalInstance._mountImage;
      node.texture.on('update', i => {
        maxWidth = Math.max(maxWidth, node.width);
        maxHeight = Math.max(maxHeight, node.height);
        count--;
        if (count <= 0) {
          this.applyLayout(maxWidth, maxHeight);
        }
      });
    }
  }
  applyLayout(maxWidth, maxHeight) {
    const paddingLeft   = this.props.padding[0],
          paddingTop    = this.props.padding[1],
          paddingRight  = this.props.padding[2],
          paddingBottom = this.props.padding[3];
    const interval = this.props.interval;
    const direction = this.props.direction;
    const baseline = this.props.baseline;

    let lastBottom = paddingTop;
    let lastRight  = paddingLeft;

    const refs = Object.keys(this.refs);
    let count = refs.length;
    for (let ref of refs) {
      const child = this.refs[ref];
      const node = child._reactInternalInstance._mountImage;

      if (direction === 'vertical') {
        node.x = lastRight + (maxWidth - node.width) * baseline;
        node.y = lastBottom;
        lastBottom += interval + node.height;
      } else {
        node.x = lastRight;
        node.y = lastBottom + (maxHeight - node.height) * baseline;
        lastRight += interval + node.width;
      }
    }

    if (direction === 'vertical') {
      this::setLayerSize(paddingLeft + maxWidth + paddingRight,
        lastBottom - interval + paddingBottom);
    } else {
      this::setLayerSize(lastRight - interval + paddingRight,
        paddingTop + maxHeight + paddingBottom);
    }
  }
  render() {
    return (
      <Layer {...combineProps(this.props, Layer.propTypes)}
        width={this.state.width} height={this.state.height}>
        {React.Children.map(this.props.children, (element, idx) => {
          return React.cloneElement(element, { ref: idx, key: idx });
        })}
      </Layer>
    );
  }
}

function setLayerSize(w, h) {
  this.setState({
    width: w,
    height: h
  });
}
