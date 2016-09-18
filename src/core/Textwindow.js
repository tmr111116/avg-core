'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import pixiTextwindow from 'Classes/Textwindow';
import { Container } from './Container';
import { transition } from './decorators/transition';

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
    var layer = this.node;

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
    props: {}
  };
  @transition('wrapper')
  execute(params, flags, name) {
    let layer = this.refs.layer;
    let promise = Promise.resolve();
    let waitClick = false;
    let clickCallback = null;
    if (flags.includes('clear')) {
      // layer.clearText();
      layer.drawText("", true); // it is a hack
    } else if (flags.includes('set')) {
      params.bgfile && (params.bgFile = params.bgfile);
      params.textrect && (params.textRect = params.textrect);
      params.xinterval && (params.xInterval = params.xinterval);
      params.yinterval && (params.yInterval = params.yinterval);
      this.setState({
        props: Object.assign({}, this.state.props, params)
      });
    } else if (flags.includes('reset')) {
      this.setState({
        props: this.props
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
      waitClick = true;
      promise = layer.drawText(params.text, true);
      clickCallback = () => layer.completeText();
    }
    return {
      waitClick: waitClick,
      promise: flags.includes('nowait') ? Promise.resolve() : promise,
      clickCallback: clickCallback
    };
  }
  reset() {
    this.setState({
      props: this.props
    });
  }
  getData() {
    let layer = this.refs.layer;
    return {...this.state.props, text: layer.text};
  }
  setData(state) {
    this.setState({
      props: state
    });
  }
  componentWillMount() {
    this.setState({
      props: this.props
    });
  }
  render() {
    return (
      <Container ref='wrapper'>
        <RawTextwindow {...this.state.props} ref={'layer'}>{this.props.children}</RawTextwindow>
      </Container>
    )
  }
}

// module.exports = Textwindow;
