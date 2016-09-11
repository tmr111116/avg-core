'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import Sprite from 'Classes/Sprite';

import equal from 'deep-equal';

var RawImage = createComponent('RawImage', ContainerMixin, NodeMixin, {

  createNode(element) {
     this.node = new Sprite();
   },
   mountNode(props) {
     var layer = this.node;
     layer.setFile(props.file).setRect(props.rect).execSync();
     layer.x = props.x || 0;
     layer.y = props.y || 0;
     return layer;
   },
   updateNode(prevProps, props) {
     var layer = this.node;
     if (prevProps.file !== props.file || !equal(prevProps.rect, props.rect)) {
       layer.setFile(props.file).setRect(props.rect).execSync();
     }
     layer.x = props.x || 0;
     layer.y = props.y || 0;
   }

});

export const Image = React.createClass({
  displayName: 'Image',
  propTypes: {
    file: React.PropTypes.string.isRequired,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    rect: React.PropTypes.arrayOf(React.PropTypes.number)
  },
  render() {
    return React.createElement(RawImage, this.props, this.props.children);
  }
});

// module.exports = Image;
