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
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import PixiLayer from 'classes/Layer';
import { load as loadResources } from 'classes/Preloader';
import Err from 'classes/ErrorHandler';

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
    this.bindCommand('stage', this);
    await this.loadScript(this.props.script);
    this.beginStory();
    // this.bindCommand(this.getChildrenArray(this.props.children));
  },
  getChildrenArray(rawChildren) {
    if (!rawChildren) {
      return [];
    } else if (rawChildren instanceof Array) {
      return rawChildren;
    }
    return [rawChildren];
  },
  async execute(params, flags, name) {
    let promise;
    if (flags.includes('goto')) {
      this.script = params.file;
      await this.loadScript(params.file);
    } else if (flags.includes('reset')) {
      await this.reset();
    } else if (flags.includes('save')) {
      const saveData = await this.getData();
      window.xxx = saveData;
    } else if (flags.includes('load')) {
      await this.reset();
      await this.setData(window.xxx);
    }
    return {
      waitClick: false,
      promise,
    };
  },
  async reset() {
    const keys = Object.keys(this.components);
    for (const key of keys) {
      const component = this.components[key];
      if (component !== this) {
        await component.reset();
      }
    }
  },
  async getData() {
    const data = {};
    const keys = Object.keys(this.components);
    for (const key of keys) {
      const component = this.components[key];
      if (component !== this) {
        const subData = await component.getData();
        data[key] = subData;
      }
    }
    data.$$scene = {
      script: this.script || this.props.script,
      data: this.parser.getData(),
    };
    return data;
  },
  async setData(data) {
    const keys = Object.keys(this.components);
    for (const key of keys) {
      const component = this.components[key];
      const subData = data[key];
      if (component !== this && subData) {
        await component.setData(subData);
      }
    }
    const sceneData = data.$$scene;
    await this.loadScript(sceneData.script);
    this.parser.setData(sceneData.data);
  },
  bindCommand(names, provider) {
    if (provider.execute && provider.reset && provider.getData && provider.setData) {
      if (typeof names === 'string') {
        this.components[names] = provider;
        console.log(`已绑定命令<${names}>`);
      } else {
        for (const name of names) {
          this.components[name] = provider;
          console.log(`已绑定命令<${name}>`);
        }
      }
    } else {
      Err.warn(`${provider.constructor.name} is not a valid command component`);
    }
  },
  async loadScript(scriptName) {
    if (scriptName) {
      const scriptFile = `${scriptName}.bks`;
      const scriptConfig = `${scriptName}.bkc`;
      this.loading = true;
      this.props.onLoading && this.props.onLoading();
      const task1 = fetch(scriptConfig)
      .then(res => res.json())
      .then(json => loadResources(json.resources, this.props.onLoadingProgress));
      const task2 = fetch(scriptFile)
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
      const { command: name, flags, params } = ret.value;
      const component = this.components[name];
      const execute = component.execute;
      if (execute) {
        this.waiting = true;
        const { promise, waitClick, clickCallback, afterClick } = await execute.call(component,
          params, flags, name);
        this.clickCallback = clickCallback;
        this.afterClick = afterClick;
        if (promise) {
          await promise;
        }
        // await promise;
        this.waiting = false;
        this.clickCallback = null;
        if (waitClick) {
          break;
        }
      } else {
        Err.warn(`Command <${name}> is not found, ignored`);
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
    return (
      <RawScene {...this.props} onClick={this.handleClick} onTap={this.handleClick}>
        {this.state.empty ? null : this.props.children}
      </RawScene>
    );
  },
});

// module.exports = Layer;
