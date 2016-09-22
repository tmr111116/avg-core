import React from 'react';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import PixiLayer from 'classes/Layer';
import PIXI from 'pixi.js';

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
