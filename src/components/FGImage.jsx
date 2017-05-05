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
import PropTypes from 'prop-types';
import core from 'core/core';
import { Layer } from './Layer';
import { Image } from './Image';
import { Transition } from 'components/transition';
import transition from 'plugins/transition';

export class FGImage extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };
  constructor(props) {
    super(props);

    this.handleScriptExec = this.handleScriptExec.bind(this);
    this.handleArchiveSave = this.handleArchiveSave.bind(this);
    this.handleArchiveLoad = this.handleArchiveLoad.bind(this);

    this.state = {
      left: null,
      center: null,
      right: null,
    };
  }
  componentDidMount() {
    core.use('script-exec', this.handleScriptExec);
    core.use('save-archive', this.handleArchiveSave);
    core.use('load-archive', this.handleArchiveLoad);

    this.execute = transition(this.transLayer, this.execute.bind(this));
  }
  componentWillUnmount() {
    core.unuse('script-exec', this.handleScriptExec);
    core.unuse('save-archive', this.handleArchiveSave);
    core.unuse('load-archive', this.handleArchiveLoad);
  }
  async execute(ctx, next) {
    const { flags, params } = ctx;

    this.setState(params);
    const positions = [];

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
      positions.map(pos => (state[pos] = null));
    } else {
      state[positions[0]] = params.file;
    }
    this.setState(state);
    await next();
  }
  async handleScriptExec(ctx, next) {
    if (ctx.command === 'fg') {
      await this.execute(ctx, next);
    } else {
      await next();
    }
  }
  async handleArchiveSave(ctx, next) {
    ctx.data.fgimage = Object.assign({}, this.state);
    await next();
  }
  async handleArchiveLoad(ctx, next) {
    this.setState({
      left: null,
      center: null,
      right: null,
      ...ctx.data.fgimage
    });
    await next();
  }
  render() {
    const width = this.props.width;
    const height = this.props.height;

    return (
      <Transition ref={transLayer => (this.transLayer = transLayer)}>
        <Layer>
          {this.state.center
            ? <Image src={this.state.center} x={Math.round(width * 0.5)} y={height} anchor={[0.5, 1]} key='center' /> : null}
          {this.state.left
            ? <Image src={this.state.left} x={Math.round(width * 0.25)} y={height} anchor={[0.5, 1]} key='left' /> : null}
          {this.state.right
            ? <Image src={this.state.right} x={Math.round(width * 0.75)} y={height} anchor={[0.5, 1]} key='right' /> : null}
        </Layer>
      </Transition>
    );
  }
}
