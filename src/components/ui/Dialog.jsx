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
const PIXI = require('pixi.js');
import { Layer } from '../Layer';
import { Image } from '../Image';

export default class Dialog extends React.Component {
  static propTypes = {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    modal: React.PropTypes.bool,
    visible: React.PropTypes.bool,
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
        x: Math.min(Math.max(this.props.width * (0 + this.props.anchor[0] || 0), state.startX + (e.global.x - state.startGlobalX)), PIXI.currentRenderer.width - this.props.width * (1 - this.props.anchor[0] || 0)),
        y: Math.min(Math.max(this.props.height * (0 + this.props.anchor[1] || 0), state.startY + (e.global.y - state.startGlobalY)), PIXI.currentRenderer.height - this.props.height * (1 - this.props.anchor[1] || 0)),
      });
    }
    // e.stopPropagation();
  }
  render() {
    const { anchor, width, height, opacity, visible } = this.props;
    const props = { anchor, width, height, opacity, visible };
    const core =  (
      <Layer
        x={this.state.x} y={this.state.y} {...props}
        onMouseDown={::this.handleMouseDown} onMouseUp={::this.handleMouseUp}
        onMouseMove={::this.handleMouseMove}>
        {this.props.children}
      </Layer>
    );
    return this.props.modal ? (<Layer visible={visible}>{core}</Layer>) : core;
  }
}
