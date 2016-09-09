'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import Sprite from 'Classes/Sprite';

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
     this.node.x = props.x || 0;
     this.node.y = props.y || 0;
   }

});

var Image = React.createClass({
  displayName: 'Image',
  propTypes: {
    file: React.PropTypes.string.isRequired,
    x: React.PropTypes.number,
    y: React.PropTypes.number
  },
  render() {
    return React.createElement(RawImage, this.props, this.props.children);
  }
});

module.exports = Image;
