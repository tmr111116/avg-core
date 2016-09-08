'use strict';

import React from 'react';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactInstanceMap from 'react/lib/ReactInstanceMap';
import invariant from 'fbjs/lib/invariant';
import ContainerMixin from 'core/ContainerMixin';

import PIXI from '../Library/pixi.js/src/index';

/**
 * Surface is a standard React component and acts as the main drawing canvas.
 * ReactCanvas components cannot be rendered outside a Surface.
 */

const Surface = React.createClass({

  mixins: [ContainerMixin],

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
    };
  },

  componentDidMount: function () {
    // Prepare the <canvas> for drawing.
    this.renderer = new PIXI.WebGLRenderer(this.props.width, this.props.height, {
      view: this.refs.canvas
    });
    this.node = new PIXI.Container();
    window.stage = this.node;
    // window.renderer = this.renderer;

    // This is the integration point between custom canvas components and React
    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(
      this.mountAndInjectChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);

    // Execute initial draw on mount.
    this.tick();
  },

  componentWillUnmount: function () {
    // Implemented in ReactMultiChild.Mixin
    this.node.removeChildren();
  },

  componentDidUpdate: function (prevProps, prevState) {
    // We have to manually apply child reconciliation since child are not
    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(
      this.updateChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);

    // Re-scale the <canvas> when changing size.
    // if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
    //   this.scale();
    // }
  },

  render: function () {
    return (
      React.createElement('canvas', {
        ref: 'canvas',
        width: this.props.width,
        height: this.props.height})
    );
  },

  // Drawing
  // =======

  scale: function () {
    // this.getContext().scale(this.props.scale, this.props.scale);
  },

  tick: function () {
    this.renderer.render(this.node);
    requestAnimationFrame(this.tick);
  }

});

module.exports = Surface;
