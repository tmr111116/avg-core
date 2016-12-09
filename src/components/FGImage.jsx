/**
 * @file        Foreground image component
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
import core from 'core/core';
import { Layer } from './Layer';
import { Image } from './Image';
import TransitionPlugin from 'plugins/transition';

export class FGImage extends React.Component {
  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  };
  state = {
    left: null,
    center: null,
    right: null,
  };
  componentDidMount() {
    core.use('script-exec', async (ctx, next) => {
      if (ctx.command === 'fg') {
        await TransitionPlugin.wrap(this.node, async (ctx, next) => {
          const { command, flags, params } = ctx;
          this.setState(params);
          let positions = [];
          if (flags.includes('left')) {
            positions.push('left');
          }
          if (flags.includes('right')) {
            positions.push('right');
          }
          if (flags.includes('center') || !positions.length) {
            positions.push('center');
          }

          const state = {};
          if (flags.includes('clear')) {
            positions.map(pos => state[pos] = null);
          } else {
            state[positions[0]] = params.file;
          }
          this.setState(state);
          await next();
        })(ctx, next);
      } else {
        await next();
      }
    });
    core.use('save-archive', async (ctx, next) => {
      ctx.data.fgimage = Object.assign({}, this.state);
      await next();
    });
    core.use('load-archive', async (ctx, next) => {
      this.setState({
        left: null,
        center: null,
        right: null,
        ...ctx.data.fgimage
      });
      await next();
    });
  }
  render() {
    return (
      <Layer ref={node => this.node = node}>
        {this.state.center ? <Image file={this.state.center} x={this.props.width * 0.5} y={this.props.height} anchor={[0.5, 1]} key="center" /> : null}
        {this.state.left ? <Image file={this.state.left} x={this.props.width * 0.25} y={this.props.height} anchor={[0.5, 1]} key="left" /> : null}
        {this.state.right ? <Image file={this.state.right} x={this.props.width * 0.75} y={this.props.height} anchor={[0.5, 1]} key="right" /> : null}
      </Layer>
    );
  }
}
