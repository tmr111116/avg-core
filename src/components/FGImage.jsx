/**
 * @file        Foreground image component
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2013-2016 Icemic Jia
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
import { Layer } from './Layer';
import { Image } from './Image';
import { transition } from 'decorators/transition';

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
  @transition
  execute(params, flags, name) {
    this.setState({ ...params });
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

    return {
      promise: Promise.resolve(),
    };
  }
  reset() {
    this.setState({
      left: null,
      center: null,
      right: null,
    });
  }
  getData() {
    return this.state;
  }
  setData(state) {
    this.setState(state);
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
