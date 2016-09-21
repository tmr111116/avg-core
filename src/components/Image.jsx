import React from 'react';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import Sprite from 'classes/Sprite';

import equal from 'deep-equal';

const RawImage = createComponent('RawImage', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new Sprite();
  },
  mountNode(props) {
    const layer = this.node;
    layer.setFile(props.file).setRect(props.rect).setAnchor(props.anchor).execSync();
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    const layer = this.node;
    if (prevProps.file !== props.file || !equal(prevProps.rect, props.rect)) {
      layer.setFile(props.file).setRect(props.rect).setAnchor(props.anchor).execSync();
    }
    layer.x = props.x || 0;
    layer.y = props.y || 0;
  },

});

export const Image = React.createClass({
  displayName: 'Image',
  propTypes: {
    file: React.PropTypes.string.isRequired,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    rect: React.PropTypes.arrayOf(React.PropTypes.number),
    children: React.PropTypes.any,
  },
  render() {
    return React.createElement(RawImage, this.props, this.props.children);
  },
});

// module.exports = Image;
