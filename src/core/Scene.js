'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import pixiLayer from 'Classes/Layer';
import Parser from 'Classes/Parser';
import * as Preloader from 'Classes/Preloader';
import Err from 'Classes/ErrorHandler';

import equal from 'deep-equal';

var RawScene = createComponent('RawScene', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new pixiLayer();
  },
  mountNode(props) {
    // color, opacity, width, height, x, y, etc.
    var layer = this.node;
    layer.setProperties(props);
    //  layer.x = props.x || 0;
    //  layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    var layer = this.node;
	  layer.setProperties(props);
  }

});

export const Scene = React.createClass({
  displayName: 'Scene',
  propTypes: {
  },
  components: {},
  parser: new Parser(),
  script: '',
  clickCallback: null,
  loading: false,
  waiting: false,
  getInitialState() {
    return {
      empty: false
    }
  },
  async componentDidMount() {
    this.bindCommand('*', this);
    await this.loadScript(this.props.script);
    this.beginStory();
    // this.bindCommand(this.getChildrenArray(this.props.children));

  },
  getChildrenArray(rawChildren) {
    if (!rawChildren) {
      return []
    } else if (rawChildren instanceof Array){
      return rawChildren;
    } else {
      return [rawChildren];
    }
  },
  async execute(params, flags, name) {
    let promise;
    if (flags.includes('goto')) {
      this.script = params.file;
      await this.loadScript(params.file);
    } else if (flags.includes('reset')) {
      await this.reset();
    } else if (flags.includes('save')) {
      let saveData = await this.getData();
      window.xxx = saveData;
      console.log(saveData);
    } else if (flags.includes('load')) {
      await this.reset();
      await this.setData(window.xxx);
    }
    return {
      waitClick: false,
      promise: promise
    }
  },
  async reset() {
    let keys = Object.keys(this.components);
    for (let key of keys) {
      let component = this.components[key];
      if (component !== this) {
        await component.reset();
      }
    }
  },
  async getData() {
    let data = {};
    let keys = Object.keys(this.components);
    for (let key of keys) {
      let component = this.components[key];
      if (component !== this) {
        let subData = await component.getData();
        data[key] = subData;
      }
    }
    data['$$scene'] = {
      script: this.script || this.props.script,
      line: this.parser.getCurrentLine()
    }
    console.log(data['$$scene'])
    return data;
  },
  async setData(data) {
    let keys = Object.keys(this.components);
    for (let key of keys) {
      let component = this.components[key];
      let subData = data[key];
      if (component !== this && subData) {
        await component.setData(subData);
      }
    }
    let sceneData = data['$$scene'];
    console.log(sceneData)
    await this.loadScript(sceneData.script);
    this.parser.setCurrentLine(sceneData.line);
  },
  bindCommand(name, provider) {
    // for (let child of children) {
      if (provider.execute && provider.reset && provider.getData && provider.setData) {
        // let name = (provider.props.commandName || provider.constructor.name).toLowerCase();

        if (typeof name === 'string') {
          this.components[name] = provider;
          console.log(`已绑定命令<${name}>`);
        } else {
          for (let _name of name) {
            this.components[_name] = provider;
            console.log(`已绑定命令<${_name}>`);
          }
        }

      } else {
        Err.warn(`${provider.constructor.name} is not a valid command component`);
      }
      // let grandChildren = this.getChildrenArray(child.props.children);
			// if (grandChildren.length) {
			// 	this.bindCommand(grandChildren);
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
      await Preloader.load(this.parser.getResources());
      this.props.onCompleteLoading && this.props.onCompleteLoading();
      this.loading = false;
		} else {
			Err.error('You must pass a script url');
		}
	},
  async beginStory() {
    let ret = this.parser.next();
		while (!ret.done) {
			let { command: name, flags, params } = ret.value;
      let component = this.components[name];
      let execute = component.execute;
			if (execute) {
        this.waiting = true;
        let { promise, waitClick, clickCallback } = await execute.call(component, params, flags, name);
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
      return
    }
    e.stopPropagation();
    let callback = this.clickCallback;
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
  }
});

// module.exports = Layer;
