/**
 * @file        Layout component
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
import { Scroller } from './Scroller';
import combineProps from 'utils/combineProps';

function getValidValueInRange(min, max, value) {
  return Math.min(Math.max(min, value), max);
}

export default class Layout extends React.Component {
  static propTypes = {
    ...Layer.propTypes,
    padding: React.PropTypes.arrayOf(React.PropTypes.number),
    direction: React.PropTypes.string,
    baseline: React.PropTypes.number,
    interval: React.PropTypes.number,
    maxWidth: React.PropTypes.number,
    maxHeight: React.PropTypes.number,
    overflowX: React.PropTypes.string,
    overflowY: React.PropTypes.string,
    scrollerOffsetX: React.PropTypes.number,
    scrollerOffsetY: React.PropTypes.number,
    children: React.PropTypes.any,
  }
  static defaultProps = {
    x: 0,
    y: 0,
    padding: [0, 0, 0, 0],
    interval: 10,
    direction: 'vertical',
    overflowX: 'scroll',
    overflowY: 'scroll',
    scrollStyle: {},
    scrollerOffsetX: 10,
    scrollerOffsetY: 10
  }
  state = {
    width: null,
    height: null,
    innerX: 0,
    innerY: 0,
    childPositions: [],
  }
  componentDidMount() {
    let maxWidth = 0;
    let maxHeight = 0;
    const refs = Object.keys(this.refs);
    let count = refs.length;
    for (let ref of refs) {
      const child = this.refs[ref];
      const node = child._reactInternalInstance._mountImage;
      if (!node.texture || node.texture === PIXI.Texture.EMPTY) {
        const bound = node.getBounds();
        maxWidth = Math.max(maxWidth, bound.width);
        maxHeight = Math.max(maxHeight, bound.height);
        count--;
        if (count <= 0) {
          this.applyLayout(maxWidth, maxHeight);
        }
      } else {
        node.texture.on('update', i => {
          const bound = node.getBounds();
          maxWidth = Math.max(maxWidth, bound.width);
          maxHeight = Math.max(maxHeight, bound.height);
          count--;
          if (count <= 0) {
            this.applyLayout(maxWidth, maxHeight);
          }
        });
      }
    }
  }
  // componentDidUpdate() {
  //   console.log(111)
  // }
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
    const childPositions = [];
    for (let ref of refs) {
      const child = this.refs[ref];
      const node = child._reactInternalInstance._mountImage;
      const bound = node.getBounds();

      if (direction === 'vertical') {
        childPositions.push(lastRight + (maxWidth - bound.width) * baseline);
        childPositions.push(lastBottom);
        // node.x = lastRight + (maxWidth - node.width) * baseline;
        // node.y = lastBottom;
        lastBottom += interval + bound.height;
      } else {
        childPositions.push(lastRight);
        childPositions.push(lastBottom + (maxHeight - bound.height) * baseline);
        // node.x = lastRight;
        // node.y = lastBottom + (maxHeight - node.height) * baseline;
        lastRight += interval + bound.width;
      }
    }

    if (direction === 'vertical') {
      this.setState({
        width: paddingLeft + maxWidth + paddingRight,
        height: lastBottom - interval + paddingBottom,
        childPositions: childPositions
      });

    } else {
      this.setState({
        width: lastRight - interval + paddingRight,
        height: paddingTop + maxHeight + paddingBottom,
        childPositions: childPositions
      });
    }

    PIXI.currentRenderer.view.addEventListener('wheel', evt => {
      const point = new PIXI.Point(evt.offsetX, evt.offsetY);
      if (this._reactInternalInstance._mountImage.containsPoint(point)) {
        this.tempScrollHandler({
          deltaX: evt.deltaX,
          deltaY: evt.deltaY,
          deltaZ: evt.deltaZ,
        });
        evt.preventDefault();
        evt.stopPropagation();
      }
    }, true);

    this.drawScrollBar();
  }
  tempScrollHandler(e) {
    // const deltaX = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    // const deltaY = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 0 : e.deltaY;
    let deltaX, deltaY, x, y;
    if (e.deltaX != null) {
      deltaX = e.deltaX;
      x = this.state.innerX - deltaX;
    } else {
      x = e.x;
    }
    if (e.deltaY != null) {
      deltaY = e.deltaY;
      y = this.state.innerY - deltaY;
    } else {
      y = e.y;
    }

    const maxWidth = this.props.maxWidth || this.state.width;
    const maxHeight = this.props.maxHeight || this.state.height;

    const innerX = getValidValueInRange(maxWidth - this.state.width, 0, x);
    const innerY = getValidValueInRange(maxHeight - this.state.height, 0, y);

    let posV, posH;
    posV = Math.min(1, Math.abs(innerY) / (this.state.height - this.props.maxHeight));
    posH = Math.min(1, Math.abs(innerX) / (this.state.width - this.props.maxWidth));

    this.setState({
      innerX: this.props.overflowX === 'scroll' ? innerX : 0,
      innerY: this.props.overflowY === 'scroll' ? innerY : 0,
      scrollButtonPosV: posV,
      scrollButtonPosH: posH,
    });
  }
  drawScrollBar() {
    let backWidthV, backHeightV, xV, yV, lengthV;
    let backWidthH, backHeightH, xH, yH, lengthH;
    const visibleV = (this.props.maxHeight < this.state.height) && this.props.overflowY === 'scroll';
    const visibleH = (this.props.maxWidth < this.state.width) && this.props.overflowX === 'scroll';
    backWidthV = this.props.scrollStyle.backgroundWidth || 10;
    backHeightH = this.props.scrollStyle.backgroundWidth || 10;
    if (visibleV) {
      backHeightV = this.props.maxHeight - (visibleH ? backHeightH : 0);
      xV = this.props.maxWidth - backWidthV;
      yV = 0;
      lengthV = this.props.maxHeight / this.state.height * this.props.maxHeight;
    }
    if (visibleH) {
      backWidthH = this.props.maxWidth - (visibleV ? backWidthV : 0);
      xH = 0;
      yH = this.props.maxHeight - backHeightH;
      lengthH = this.props.maxWidth / this.state.width * this.props.maxWidth;
    }
    this.setState({
      scrollBackColorV: this.state.scrollBackColorV,
      scrollBackAlphaV: this.state.scrollBackAlphaV,
      scrollBackHeightV: backHeightV,
      scrollXV: xV,
      scrollYV: yV,
      scrollVisibleV: visibleV,
      scrollButtonLengthV: lengthV,
      scrollBackColorH: this.state.scrollBackColorH,
      scrollBackAlphaH: this.state.scrollBackAlphaH,
      scrollBackWidthH: backWidthH,
      scrollXH: xH,
      scrollYH: yH,
      scrollVisibleH: visibleH,
      scrollButtonLengthH: lengthH,
    })
  }
  scrollDragV(e) {
    this.tempScrollHandler({ deltaX: 0, deltaY: e.deltaY * this.state.height });
  }
  scrollDragH(e) {
    this.tempScrollHandler({ deltaX: e.deltaX * this.state.width, deltaY: 0 });
  }
  handleTouchStart(e) {
    this.setState({
      touching: true,
      touchX: e.local.x,
      touchY: e.local.y,
      originX: this.state.innerX,
      originY: this.state.innerY,
    });
  }
  handleTouchMove(e) {
    const point = e.global;
    if (this._reactInternalInstance._mountImage.containsPoint(point)) {
      const x = this.state.originX - this.state.touchX + e.local.x;
      const y = this.state.originY - this.state.touchY + e.local.y;
      this.tempScrollHandler({ x: x, y: y });
      e.stopPropagation();
    }
  }
  render() {
    const {
      backgroundColor,
      backgroundAlpha,
      backgroundWidth,
      buttonColor,
      buttonAlpha,
      buttonWidth
    } = {
      backgroundColor: 0xffffff,
      backgroundAlpha: 0.6,
      backgroundWidth: 10,
      buttonColor: 0xffffff,
      buttonAlpha: 1,
      buttonWidth: 6,
      ...this.props.scrollStyle
    }
    return (
      <Layer {...combineProps(this.props, Layer.propTypes)}
        ref={node => this.node = node}
        width={this.props.maxWidth || this.state.width}
        height={this.props.maxHeight || this.state.height}
        onTouchStart={::this.handleTouchStart}
        onTouchMove={::this.handleTouchMove}>
        <Layer x={this.state.innerX} y={this.state.innerY}
          width={this.state.width} height={this.state.height}>
          {React.Children.map(this.props.children, (element, index) => {
            return React.cloneElement(element,
              {
                ref: index,
                key: index,
                x: this.state.childPositions[index * 2],
                y: this.state.childPositions[index * 2 + 1],
              });
          })}
        </Layer>
        <Scroller backgroundColor={backgroundColor}
                  backgroundAlpha={backgroundAlpha}
                  backgroundWidth={backgroundWidth}
                  backgroundHeight={this.state.scrollBackHeightV}
                  x={this.state.scrollXV - this.props.scrollerOffsetX} y={this.state.scrollYV}
                  visible={this.state.scrollVisibleV}
                  direction='vertical'
                  buttonWidth={buttonWidth}
                  buttonColor={buttonColor}
                  buttonAlpha={this.state.scrollButtonAlphaV || buttonAlpha}
                  buttonLength={this.state.scrollButtonLengthV}
                  buttonPosition={this.state.scrollButtonPosV} key='scrollV'
                  onDrag={::this.scrollDragV}
                  onMouseover={() => this.setState({ scrollButtonAlphaV: 1 })}
                  onMouseout={() => this.setState({ scrollButtonAlphaV: buttonAlpha})}
                  onTouchStart={() => this.setState({ scrollButtonAlphaV: 1 })}
                  onTouchEnd={() => this.setState({ scrollButtonAlphaV: buttonAlpha})}
                  onTouchEndOutside={() => this.setState({ scrollButtonAlphaV: buttonAlpha})} />
        <Scroller backgroundColor={backgroundColor}
                  backgroundAlpha={backgroundAlpha}
                  backgroundWidth={this.state.scrollBackWidthH}
                  backgroundHeight={backgroundWidth}
                  x={this.state.scrollXH} y={this.state.scrollYH - this.props.scrollerOffsetY}
                  visible={this.state.scrollVisibleH}
                  direction='horizental'
                  buttonWidth={buttonWidth}
                  buttonColor={buttonColor}
                  buttonAlpha={this.state.scrollButtonAlphaH || buttonAlpha}
                  buttonLength={this.state.scrollButtonLengthH}
                  buttonPosition={this.state.scrollButtonPosH} key='scrollH'
                  onDrag={::this.scrollDragH}
                  onMouseover={() => this.setState({ scrollButtonAlphaH: 1 })}
                  onMouseout={() => this.setState({ scrollButtonAlphaH: buttonAlpha})}
                  onTouchStart={() => this.setState({ scrollButtonAlphaH: 1 })}
                  onTouchEnd={() => this.setState({ scrollButtonAlphaH: buttonAlpha})}
                  onTouchEndOutside={() => this.setState({ scrollButtonAlphaH: buttonAlpha})} />
        <Layer visible={this.state.scrollVisibleV && this.state.scrollVisibleH}
               width={backgroundWidth}
               height={backgroundWidth}
               x={this.state.scrollXV} y={this.state.scrollYH}
               fillColor={backgroundColor} fillAlpha={backgroundAlpha} />
      </Layer>
    );
  }
}
