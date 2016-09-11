'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import pixiTextwindow from 'Classes/Textwindow';

import equal from 'deep-equal';

var RawTextwindow = createComponent('RawTextwindow', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new pixiTextwindow();
  },
  mountNode(props) {
     // color, opacity, width, height, x, y, etc.
    var layer = this.node;

    props.textRect && layer.setTextRectangle(props.textRect);
    props.xInterval != null && layer.setXInterval(props.xInterval);
    props.yInterval != null && layer.setYInterval(props.yInterval);
    props.bgFile && layer.setBackgroundFile(props.bgFile);
    props.opacity != null && layer.setBackgroundFile(props.opacity);
    props.visible != null && layer.setVisible(props.visible);
    props.font && layer.setTextFont(props.font);
    props.size && layer.setTextSize(props.size);
    props.color != null && layer.setTextColor(props.color);
    props.bold != null && layer.setTextBold(props.bold);
    props.italic != null && layer.setTextItalic(props.italic);
    props.italic != null && layer.setTextItalic(props.italic);
    props.speed && layer.setTextSpeed(props.speed);
    props.text && layer.drawText(props.text, true);
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    var layer = this.node;
	//  layer.setProperties(props);
  }

});

export class Textwindow extends React.Component {
  static displayName = 'Textwindow';
  static propTypes = {
    // width: React.PropTypes.number.isRequired,
    // height: React.PropTypes.number.isRequired,
    // x: React.PropTypes.number,
    // y: React.PropTypes.number
  };
  state = {

  }
  execute(params, flags=[], name) {
    let layer = this.refs.layer;
    let promise;
    if (flags.includes('clear')) {
      promise = layer.clearText();
    }
    if (flags.includes('continue')) {
      promise = layer.drawText(params.text, false);
    } else {
      promise = layer.drawText(params.text, true);
    }
    return {
      waitClick: true,
      promise: flags.includes('nowait') ? Promise.resolve() : promise,
      clickCallback: () => {
        layer.completeText();
      }
    };
  }
  componentDidMount() {
    // console.log(this)
  }
  render() {
    return <RawTextwindow {...this.props} ref={'layer'}>{this.props.children}</RawTextwindow>
  }
}

// module.exports = Textwindow;
