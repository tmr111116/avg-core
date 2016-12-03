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
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import PixiTextwindow from 'classes/Textwindow';

import { Layer } from './Layer';
import { transition } from 'decorators/transition';


const RawTextwindow = createComponent('RawTextwindow', ContainerMixin, NodeMixin, {

  createNode(element) {
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
  static propTypes = {
    // width: React.PropTypes.number.isRequired,
    // height: React.PropTypes.number.isRequired,
    // x: React.PropTypes.number,
    // y: React.PropTypes.number
    children: React.PropTypes.any,
  };
  state = {
    props: {},
  };
  @transition
  execute(params, flags, name) {
    const layer = this.layer;
    let promise = Promise.resolve();
    let waitClick = false;
    let clickCallback = null;
    let afterClick = null;
    if (name === 'r') {
      // waitClick = true;
      promise = layer.drawText('\n', false);
      clickCallback = () => layer.completeText();
    } else if (name === 'l') {
      waitClick = true;
    } else if (name === 'p') {
      waitClick = true;
      // promise = layer.drawText('', true);
      clickCallback = () => layer.completeText();
      afterClick = () => layer.drawText('', true);
    } else if (flags.includes('clear')) {
      // layer.clearText();
      layer.drawText('', true); // it is a hack
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
      clickCallback = () => layer.completeText();
    } else {
      waitClick = false;
      promise = layer.drawText(params.text, false);
      clickCallback = () => layer.completeText();
    }
    return {
      waitClick,
      promise: flags.includes('nowait') ? Promise.resolve() : promise,
      clickCallback,
      afterClick,
    };
  }
  reset() {
    this.setState({
      props: this.props,
    });
  }
  getData() {
    const layer = this.layer;
    return { ...this.state.props, text: layer.text };
  }
  async setData(state) {
    this.setState({
      props: state,
    });
    const layer = this.layer;
    layer.drawText(state.text, true);
    layer.completeText();
  }
  componentWillMount() {
    this.setState({
      props: this.props,
    });
  }
  render() {
    return (
      <Layer ref={node => this.node = node}>
        <RawTextwindow {...this.state.props} ref={layer => this.layer = layer}>
          {this.props.children}
        </RawTextwindow>
      </Layer>
    );
  }
}

// module.exports = Textwindow;
