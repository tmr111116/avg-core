import React from 'react';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import PixiLayer from 'classes/Layer';
import Parser from 'classes/Parser';
import * as Preloader from 'classes/Preloader';
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
    script: React.PropTypes.string,
    onLoading: React.PropTypes.func,
    onCompleteLoading: React.PropTypes.func,
    onLoadingProgress: React.PropTypes.func,
    children: React.PropTypes.any,
  },
  components: {},
  parser: new Parser(),
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
    this.bindCommand('*', this);
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
      console.log(saveData);
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
      line: this.parser.getCurrentLine(),
    };
    console.log(data.$$scene);
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
    console.log(sceneData);
    await this.loadScript(sceneData.script);
    this.parser.setCurrentLine(sceneData.line);
  },
  bindCommand(names, provider) {
    // for (let child of children) {
    if (provider.execute && provider.reset && provider.getData && provider.setData) {
      // let name = (provider.props.commandName || provider.constructor.name).toLowerCase();

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
      // let grandChildren = this.getChildrenArray(child.props.children);
      // if (grandChildren.length) {
      //   this.bindCommand(grandChildren);
      // }
    // }
  },
  async loadScript(scriptUrl) {
    if (scriptUrl) {
      this.loading = true;
      this.props.onLoading && this.props.onLoading();
      await fetch(scriptUrl)
      .then(res => res.text())
      .then(text => this.parser.load(text.trim()));
      await Preloader.load(this.parser.getResources(), this.props.onLoadingProgress);
      this.props.onCompleteLoading && this.props.onCompleteLoading();
      this.loading = false;
    } else {
      Err.error('You must pass a script url');
    }
  },
  async beginStory() {
    let ret = this.parser.next();
    while (!ret.done) {
      const { command: name, flags, params } = ret.value;
      const component = this.components[name];
      const execute = component.execute;
      if (execute) {
        this.waiting = true;
        const { promise, waitClick, clickCallback } = await execute.call(component,
          params, flags, name);
        this.clickCallback = clickCallback;
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
