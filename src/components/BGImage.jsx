/**
 * @file        Background image component
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
import { Image } from './Image';
import TransitionPlugin from 'plugins/transition';

export class BGImage extends React.Component {
  constructor(props) {
    super(props);

    this.handleScriptExec = this.handleScriptExec.bind(this);
    this.handleArchiveSave = this.handleArchiveSave.bind(this);
    this.handleArchiveLoad = this.handleArchiveLoad.bind(this);

    this.transitionHandler = null;

    this.state = {
      file: null,
      x: 0,
      y: 0,
    };
  }
  componentDidMount() {
    this.transitionHandler = TransitionPlugin.wrap(this.node, async (ctx, next) => {
      const { command, flags, params } = ctx;
      this.setState(params);
      await next();
    });
    core.use('script-exec', this.handleScriptExec);
    core.use('save-archive', this.handleArchiveSave);
    core.use('load-archive', this.handleArchiveLoad);
  }
  componentWillUnmount() {
    core.unuse('script-exec', this.handleScriptExec);
    core.unuse('save-archive', this.handleArchiveSave);
    core.unuse('load-archive', this.handleArchiveLoad);
  }
  async handleScriptExec(ctx, next) {
    if (ctx.command === 'bg') {
      await this.transitionHandler(ctx, next);
    } else {
      await next();
    }
  }
  async handleArchiveSave(ctx, next) {
    ctx.data.bgimage = Object.assign({}, this.state);
    await next();
  }
  async handleArchiveLoad(ctx, next) {
    this.setState({
      file: null,
      x: 0,
      y: 0,
      ...ctx.data.bgimage
    });
    await next();
  }
  render() {
    // TODO: It's weired that if you wrap Image with Layer.
    return <Image file={this.state.file || ''} x={0} y={0} ref={node => this.node = node} />;
  }
}
