'use strict';

// Adapted from ReactART:
// https://github.com/reactjs/react-art

const React = require('react');
const ReactMultiChild = require('react/lib/ReactMultiChild');
const emptyObject = require('fbjs/lib/emptyObject');

const ContainerMixin = Object.assign({}, ReactMultiChild.Mixin, {

  /**
   * Moves a child component to the supplied index.
   *
   * @param {ReactComponent} child Component to move.
   * @param {number} toIndex Destination index of the element.
   * @protected
   */
  moveChild: function(child, afterNode, toIndex, lastIndex) {
    // console.log('move:', child._mountImage.filename, 'to', toIndex);
    var childNode = child._mountImage;
    let layer = this.node;
    layer.addChild(childNode);
  },

  /**
   * Creates a child component.
   *
   * @param {ReactComponent} child Component to create.
   * @param {object} childNode ART node to insert.
   * @protected
   */
  createChild: function(child, afterNode, childNode) {
    // console.log('create:', childNode.filename)
    child._mountImage = childNode;
    let layer = this.node;
    layer.addChild(childNode);
  },

  /**
   * Removes a child component.
   *
   * @param {ReactComponent} child Child to remove.
   * @protected
   */
  removeChild: function(child) {
    // console.log('remove:', child._mountImage.filename)
    this.node.removeChild(child._mountImage);
    child._mountImage.destroy();
    child._mountImage = null;
  },

  mountAndInjectChildren: function(children, transaction, context) {
    var mountedImages = this.mountChildren(
      children,
      transaction,
      context
    );

    // Each mount image corresponds to one of the flattened children
    var i = 0;
    for (var key in this._renderedChildren) {
      if (this._renderedChildren.hasOwnProperty(key)) {
        var child = this._renderedChildren[key];
        child._mountImage = mountedImages[i];
		    this.node.addChild(mountedImages[i]);
        // mountedImages[i].inject(this.node);
        i++;
      }
    }
  }

});

export default ContainerMixin;
