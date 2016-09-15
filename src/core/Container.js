'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import pixiContainer from 'Classes/Container';

import equal from 'deep-equal';

var RawContainer = createComponent('RawContainer', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new pixiContainer();
  },
  mountNode(props) {
    // color, opacity, width, height, x, y, etc.
    var layer = this.node;
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    layer.alpha = props.opactiy || 1;
    return layer;
  },
  updateNode(prevProps, props) {
    var layer = this.node;
	  layer.x = props.x || 0;
	  layer.y = props.y || 0;
    layer.alpha = props.opactiy || 1;
  }

});

export const Container = React.createClass({
  displayName: 'Container',
  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number
  },
  render() {
    return React.createElement(RawContainer, this.props, this.props.children);
  }
});

// module.exports = Container;
