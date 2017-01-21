/**
 * @file        Textwindow component
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
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import PixiTextwindow from 'classes/TextWindow';
import pixiPropTypes from './pixi/propTypes';
import { Transition } from 'components/transition';
import transition from 'plugins/transition';

const RawTextwindow = createComponent('RawTextwindow', ContainerMixin, NodeMixin, {

  createNode() {
    this.node = new PixiTextwindow();
  },
  mountNode(props) {
     // color, opacity, width, height, x, y, etc.
    const layer = this.node;

    props.textRect && layer.setTextRectangle(props.textRect);
    props.xInterval != null && layer.setXInterval(props.xInterval);
    props.yInterval != null && layer.setYInterval(props.yInterval);
    props.bgFile && layer.setBackgroundFile(props.bgFile);
    props.opacity != null && layer.setOpacity(props.opacity);
    props.visible != null && layer.setVisible(props.visible);
    props.font && layer.setTextFont(props.font);
    props.size && layer.setTextSize(props.size);
    props.color != null && layer.setTextColor(props.color);
    props.bold != null && layer.setTextBold(props.bold);
    props.italic != null && layer.setTextItalic(props.italic);
    props.speed && layer.setTextSpeed(props.speed);
    props.text && layer.drawText(props.text, true);
    layer.x = props.x || 0;
    layer.y = props.y || 0;

    return layer;
  },
  updateNode(prevProps, props) {
    const layer = this.node;

    prevProps.textRect !== props.textRect && layer.setTextRectangle(props.textRect);
    prevProps.xInterval !== props.xInterval && layer.setXInterval(props.xInterval || 0);
    prevProps.yInterval !== props.yInterval && layer.setYInterval(props.yInterval || 0);
    prevProps.bgFile !== props.bgFile && layer.setBackgroundFile(props.bgFile);
    prevProps.opacity !== props.opacity && layer.setOpacity(props.opacity);
    prevProps.visible !== props.visible && layer.setVisible(props.visible);
    prevProps.font !== props.font && layer.setTextFont(props.font);
    prevProps.size !== props.size && layer.setTextSize(props.size);
    prevProps.color !== props.color && layer.setTextColor(props.color);
    prevProps.bold !== props.bold && layer.setTextBold(props.bold);
    prevProps.italic !== props.italic && layer.setTextItalic(props.italic);
    prevProps.speed !== props.speed && layer.setTextSpeed(props.speed);
    layer.x = props.x || 0;
    layer.y = props.y || 0;

  //  layer.setProperties(props);
  },

});

export class Textwindow extends React.Component {
  static displayName = 'Textwindow';
  static propTypes = pixiPropTypes;
  constructor(props) {
    super(props);

    this.handleScriptExec = this.handleScriptExec.bind(this);
    this.handleScriptTrigger = this.handleScriptTrigger.bind(this);
    this.handleArchiveSave = this.handleArchiveSave.bind(this);
    this.handleArchiveLoad = this.handleArchiveLoad.bind(this);

    this.transitionHandler = null;

    this.state = {
      props: {},
    };
  }
  componentWillMount() {
    this.setState({
      props: this.props,
    });
  }
  componentDidMount() {
    core.use('script-trigger', this.handleScriptTrigger);
    core.use('script-exec', this.handleScriptExec);
    core.use('save-archive', this.handleArchiveSave);
    core.use('load-archive', this.handleArchiveLoad);

    this.execute = transition(this.transLayer, this.execute.bind(this));
  }
  componentWillUnmount() {
    core.unuse('script-trigger', this.handleScriptTrigger);
    core.unuse('script-exec', this.handleScriptExec);
    core.unuse('save-archive', this.handleArchiveSave);
    core.unuse('load-archive', this.handleArchiveLoad);
  }
  async execute(ctx, next) {
    const { command, flags, params } = ctx;
    const layer = this.layer;
    let promise = Promise.resolve();
    let waitClick = false;
    let clickCallback = false;
    let switchPageAfterClick = false;

    if (command === 'r') {
      // waitClick = true;
      promise = layer.drawText('\n', false);
      clickCallback = true;
    } else if (command === 'l') {
      waitClick = true;
    } else if (command === 'p') {
      waitClick = true;
      // promise = layer.drawText('', true);
      clickCallback = true;
      switchPageAfterClick = true;
    } else if (flags.includes('clear')) {
      // layer.clearText();
      // it is a hack
      layer.drawText('', true);
    } else if (flags.includes('set')) {
      params.bgfile && (params.bgFile = params.bgfile);
      params.textrect && (params.textRect = params.textrect);
      params.xinterval != null && (params.xInterval = params.xinterval);
      params.yinterval != null && (params.yInterval = params.yinterval);
      this.setState({
        props: Object.assign({}, this.state.props, params),
      });
    } else if (flags.includes('reset')) {
      this.setState({
        props: this.props,
      });
    } else if (flags.includes('show')) {
      layer.setVisible(true);
    } else if (flags.includes('hide')) {
      layer.setVisible(false);
    } else if (flags.includes('continue')) {
      waitClick = true;
      promise = layer.drawText(params.text, false);
      clickCallback = true;
    } else {
      waitClick = false;
      promise = layer.drawText(params.text, false);
      clickCallback = true;
    }
    this.state.clickCallback = clickCallback;
    this.state.switchPageAfterClick = switchPageAfterClick;
    ctx.break = waitClick;
    await ((flags.includes('nowait') || flags.includes('_skip_')) ? Promise.resolve() : promise);
    if (flags.includes('_skip_')) {
      await this.layer.completeText();
    }
    this.state.clickCallback = false;
    await next();
  }
  async handleScriptTrigger(ctx, next) {
    if (this.state.switchPageAfterClick) {
      await this.layer.drawText('', true);
      this.state.switchPageAfterClick = false;
    }
    if (this.state.clickCallback) {
      this.layer.completeText();
      this.state.clickCallback = false;
    } else {
      await next();
    }
  }
  async handleScriptExec(ctx, next) {
    if (['text', 'r', 'l', 'p', '*'].includes(ctx.command)) {
      if (ctx.params.raw) {
        ctx.params.text = ctx.params.raw;
      }
      await this.execute(ctx, next);
    } else {
      await next();
    }
  }
  async handleArchiveSave(ctx, next) {
    const layer = this.layer;

    ctx.data.textwindow = { ...this.state.props, text: layer.text, children: null };
    await next();
  }
  async handleArchiveLoad(ctx, next) {
    this.setState({
      props: {
        ...this.props,
        ...ctx.data.textwindow
      }
    });
    const layer = this.layer;

    layer.setVisible(true);
    layer.drawText(ctx.data.textwindow.text, true);
    // layer.completeText();
    await next();
  }
  render() {
    return (
      <Transition ref={transLayer => (this.transLayer = transLayer)}>
        <RawTextwindow {...this.state.props} ref={layer => (this.layer = layer)}>
          {this.props.children}
        </RawTextwindow>
      </Transition>
    );
  }
}

// module.exports = Textwindow;
