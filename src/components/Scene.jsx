/**
 * @file        Scene component
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
import StoryScript from 'avg-storyscript';
import core from 'core/core';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import PixiLayer from 'classes/Layer';
import { load as loadResources } from 'classes/Preloader';
import Err from 'classes/ErrorHandler';
import fetchLocal from 'utils/fetchLocal';

const RawScene = createComponent('RawScene', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new PixiLayer();
  },
  mountNode(props) {
    // color, opacity, width, height, x, y, etc.
    const layer = this.node;
    layer.setProperties(props);
    //  layer.x = props.x || 0;
    //  layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    const layer = this.node;
    layer.setProperties(props);
  },
});

export const Scene = React.createClass({
  displayName: 'Scene',
  propTypes: {
    script: React.PropTypes.string.isRequired,
    onLoading: React.PropTypes.func,
    onLoadingComplete: React.PropTypes.func,
    onLoadingProgress: React.PropTypes.func,
    children: React.PropTypes.any,
  },
  components: {},
  parser: new StoryScript(),
  script: '',
  clickCallback: null,
  loading: false,
  waiting: false,
  getInitialState() {
    return {
      empty: false,
    };
  },
  async componentDidMount() {
    core.use('click', async (ctx, next) => {
      await next();
      await this.handleClick(ctx);
    });

    core.use('script-exec', async (ctx, next) => {
      const { command, flags, params } = ctx;
      if (command === 'scene') {
        if (flags.includes('goto')) {
          this.script = params.file;
          await this.loadScript(params.file);
        } else if (flags.includes('reset')) {
          // await this.reset();
        } else if (flags.includes('save')) {
          const name = params.name || 'default';
          await core.post('save-achieve', { name: name });
        } else if (flags.includes('load')) {
          // await this.reset();
          await core.post('load-achieve', { name: name });
          // await this.setData(window.xxx);
        }
      } else {
        await next();
      }
    });

    core.use('save-achieve', async (ctx, next) => {
      var $$scene = {
        script: this.script || this.props.script,
        data: this.parser.getData(),
      };
      ctx.data.$$scene = $$scene;
      await next();
    });

    core.use('load-achieve', async (ctx, next) => {
      const sceneData = ctx.data.$$scene;
      await this.loadScript(sceneData.script);
      this.parser.setData(sceneData.data);
      await next();
    });

    await this.loadScript(this.props.script);
    this.beginStory();
  },
  async loadScript(scriptName) {
    if (scriptName) {
      const scriptFile = `${scriptName}.bks`;
      const scriptConfig = `${scriptName}.bkc`;
      this.loading = true;
      this.props.onLoading && this.props.onLoading();
      const task1 = fetchLocal(scriptConfig)
      .then(res => res.json())
      .then(json => loadResources(json.resources, this.props.onLoadingProgress));
      const task2 = fetchLocal(scriptFile)
      .then(res => res.text())
      .then(text => this.parser.load(text.trim()));

      await Promise.all([task1, task2]);

      this.props.onLoadingComplete && this.props.onLoadingComplete();
      this.loading = false;
    } else {
      Err.error('You must pass a script url');
    }
  },
  async beginStory() {
    if (this.afterClick) {
      this.afterClick();
      this.afterClick = null;
    }
    let ret = this.parser.next();
    while (!ret.done) {
      // const { command: name, flags, params } = ret.value;
      const context = Object.assign({}, ret.value);
      await core.post('script-exec', context);
      if (context.break) {
        break;
      }
      ret = this.parser.next();
    }
    if (ret.done) {
      Err.warn(`Script executed to end`);
    }
  },
  handleClick(e) {
    if (this.loading) {
      return;
    }
    e.stopPropagation();
    const callback = this.clickCallback;
    if (callback) {
      callback(e);
    } else {
      !this.waiting && this.beginStory();
    }
  },
  render() {
    // onClick={this.handleClick} onTap={this.handleClick}
    return (
      <RawScene {...this.props}>
        {this.state.empty ? null : this.props.children}
      </RawScene>
    );
  },
});

// module.exports = Layer;
