import React from 'react';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import PixiContainer from 'classes/Sprite';

const RawContainer = createComponent('RawContainer', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new PixiContainer();
  },
  mountNode(props) {
    // color, opacity, width, height, x, y, etc.
    const layer = this.node;
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    layer.alpha = props.opactiy || 1;
    return layer;
  },
  updateNode(prevProps, props) {
    const layer = this.node;
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    layer.alpha = props.opactiy || 1;
  },

});

export const Container = React.createClass({
  displayName: 'Container',
  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    children: React.PropTypes.any,
  },
  render() {
    return React.createElement(RawContainer, this.props, this.props.children);
  },
});

// module.exports = Container;
