import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import PixiLayer from 'Classes/Layer';
import PIXI from 'Library/pixi.js/src/index';

const RawLayer = createComponent('RawLayer', ContainerMixin, NodeMixin, {

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

export const Layer = React.createClass({
  displayName: 'Layer',
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    children: React.PropTypes.any,
  },
  render() {
    const props = {
      width: PIXI.currentRenderer.width,
      height: PIXI.currentRenderer.height,
      opacity: 0,
      ...this.props,
    };
    return React.createElement(RawLayer, props, this.props.children);
  },
});

// module.exports = Layer;
