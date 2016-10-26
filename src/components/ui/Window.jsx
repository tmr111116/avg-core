/**
 * @file        Window component
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
import { Layer } from '../Layer';
import { Image } from '../Image';

export default class Window extends React.Component {
  static propTypes = {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    dragable: React.PropTypes.bool,
    dragArea: React.PropTypes.arrayOf(React.PropTypes.number),
    children: React.PropTypes.any,
  }
  static defaultProps = {
    x: 0,
    y: 0,
    dragable: false,
    dragArea: [0, 0, 0, 0],
  }
  state = {
    clicked: false,
    x: this.props.x || 0,
    y: this.props.y || 0,
  }
  handleMouseDown(e) {
    const [left, top, right, bottom] = this.props.dragArea;
    const { x, y } = e.local;
    if (this.props.dragable && x > left && x < right && y > top && y < bottom) {
      this.setState({
        clicked: true,
        startX: this.state.x,
        startY: this.state.y,
        startGlobalX: e.global.x,
        startGlobalY: e.global.y,
      });
      e.stopPropagation();
    }
  }
  handleMouseUp(e) {
    if (this.state.clicked) {
      this.setState({
        clicked: false,
      });
      e.stopPropagation();
    }
  }
  handleMouseMove(e) {
    if (this.state.clicked) {
      const state = this.state;
      this.setState({
        x: state.startX + (e.global.x - state.startGlobalX),
        y: state.startY + (e.global.y - state.startGlobalY),
      });
    }
    e.stopPropagation();
  }

  render() {
    return (
      <Layer
        x={this.state.x} y={this.state.y} opacity={0.5}
        width={this.props.width} height={this.props.height}
        onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}>
        {this.props.children}
      </Layer>
    )
  }
}
