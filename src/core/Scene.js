'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import pixiLayer from 'Classes/Layer';
import Parser from 'Classes/Parser';
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
  handlers: {},
  parser: new Parser(),
  clickCallback: null,
  async componentDidMount() {
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
  bindCommand(children) {
    for (let child of children) {
      if (child.execute) {
        let name = (child.props.commandName || child.constructor.name).toLowerCase();
        this.handlers[name] = child.execute.bind(child);
        console.log(`已绑定命令<${name}>`);
      }
      let grandChildren = this.getChildrenArray(child.props.children);
			if (grandChildren.length) {
				this.bindCommand(grandChildren);
			}
    }
  },
  loadScript(scriptUrl) {
		if (scriptUrl) {
			return fetch(scriptUrl)
			.then(res => res.text())
			.then(text => {
				console.log(text);
				this.parser.load(text);
			});
		} else {
			Err.warn('You must pass a script url');
		}
	},
  async beginStory() {
		let ret = this.parser.next();
		while (!ret.done) {
			let { command: name, flags, params } = ret.value;
      let execute = this.handlers[name];
			if (execute) {
        let { promise, waitClick, clickCallback } = execute(params, flags, name);
        this.clickCallback = clickCallback;
        await promise;
        this.clickCallback = null;
        if (waitClick) {
          break;
        }
      } else {
        Err.warn(`Command <${name}> is not found, ignored`);
      }
			ret = this.parser.next();
		}
	},
  nextLine() {
    this.beginStory();
  },
  handleClick(e) {
    e.stopPropagation();
    // 栈形式
    let callback = this.clickCallback;
    if (callback) {
      callback(e);
      // this.clickCallbackStack.delete(callback);
    } else {
      this.nextLine();
    }
  },
  render() {
    return (
      <RawScene {...this.props} onClick={this.handleClick} onTap={this.handleClick}>
        {this.props.children}
      </RawScene>
    );
  }
});

// module.exports = Layer;
