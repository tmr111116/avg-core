'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import pixiLayer from 'Classes/Layer';

import equal from 'deep-equal';

var RawLayer = createComponent('RawLayer', ContainerMixin, NodeMixin, {

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

export const Layer = React.createClass({
  displayName: 'Layer',
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    x: React.PropTypes.number,
    y: React.PropTypes.number
  },
  render() {
    return React.createElement(RawLayer, this.props, this.props.children);
  }
});

// module.exports = Layer;
