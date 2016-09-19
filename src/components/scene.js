/**@jsx createElement*/

import { createElement } from 'core/core';
import { Component } from 'core/component';
import { Container } from 'components/container';
import { attachToSprite } from 'Classes/EventManager';
import Parser from 'Classes/Parser';
import Err from 'Classes/ErrorHandler';

export class Scene extends Container {
  constructor(props) {
    super(props);

    // this.parser = new Parser();
    this.handlers = {};
    this.contexts = {};

    this.prevElement = this;
  }
  componentWillReceiveProps(nextProps) {

  }
  componentDidMount() {
    // this.bindCommand(this.props.children);
    // await this.loadScript(this.props.script);
    // this.beginStory();
  }
  bindCommand(children) {
    for (let child of children) {
      if (child.commandHandler && !child.disableBinding) {
        let name = (child.props.commandName || child.constructor.name).toLowerCase();
        this.handlers[name] = child.commandHandler;
        this.contexts[name] = child;
        console.log(`已绑定命令<${name}>`);
      }
      let grandChildren = child.props.children;
      if (grandChildren.length) {
        this.bindCommand(grandChildren);
      }
    }
  }
  /**
   * handler: function (params, flags, name)
   */
  registerCommand(name, handler) {
    this.handler[name] = handler;
  }
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
  }
  async beginStory() {
    let ret = this.parser.next();
    while (!ret.done) {
      console.log(ret.value);
      let { command: name, flags, params } = ret.value;
      console.log(name)
      await this.handlers[name].call(this.contexts[name], params, flags, name);
      ret = this.parser.next();
    }
  }
  executeCommand(data) {

  }

}
