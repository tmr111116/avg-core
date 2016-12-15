/**
 * @file        Surface component
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2015-2016 Icemic Jia
 * @link        https://www.avgjs.org
 * @license     Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactInstanceMap from 'react/lib/ReactInstanceMap';
import ContainerMixin from 'components/ContainerMixin';

const PIXI = require('pixi.js');
import core from 'core/core';
import Container from 'classes/Container';
import { attachToSprite } from 'classes/EventManager';
import { init as preloaderInit } from 'classes/Preloader';

import isMobile from 'ismobilejs';

/**
 * Surface is a standard React component and acts as the main drawing canvas.
 * ReactCanvas components cannot be rendered outside a Surface.
 */

export const Surface = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    source: React.PropTypes.string,
    children: React.PropTypes.any,
  },

  mixins: [ContainerMixin],

  getDefaultProps() {
    return {
      source: './',
    };
  },

  componentWillMount() {
    let source = this.props.source;
    if (!source.endsWith('/')) {
      source = source + '/';
    }
    preloaderInit(source);
  },

  componentDidMount() {
    // Prepare the <canvas> for drawing.
    this.renderer = new PIXI.WebGLRenderer(this.props.width, this.props.height, {
      view: this.canvas,
    });
    PIXI.currentRenderer = this.renderer;
    this.node = new Container();
    attachToSprite(this.node);
    this.node._ontap = e => core.post('tap', e);
    this.node._onclick = e => core.post('click', e);
    window.stage = this.node;
    // window.renderer = this.renderer;

    // This is the integration point between custom canvas components and React
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(
      this.mountAndInjectChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);

    if (isMobile.any) {
      this.scale();
      this.tickMobile();
    } else {
      this.tick();
    }
  },


  componentDidUpdate(prevProps, prevState) {
    // We have to manually apply child reconciliation since child are not
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
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

  componentWillUnmount() {
    // Implemented in ReactMultiChild.Mixin
    this.node.removeChildren();
  },

  scale() {
    var width = window.screen.availWidth;
    var height = window.screen.availHeight;
    const renderer = this.renderer;

    var ratio = renderer.width/renderer.height;

    var offsetW, offsetH, contentW, contentH;
    if (ratio > width / height) {
        contentW = width;
        contentH = width / ratio;
        offsetW = 0;
        offsetH = (height - width / ratio) / 2;
    } else {
        contentW = height * ratio;
        contentH = height;
        offsetW = (width - height * ratio) / 2;
        offsetH = 0;
    }

    renderer.view.style.position = 'absolute';
    // renderer.view.style.width = contentW + "px";
    // renderer.view.style.height = contentH + "px";
    renderer.view.style.backfaceVisibility = 'hidden';
    renderer.view.style.transformOrigin = 'left top';
    renderer.view.style.transform = `scale(${contentW/renderer.width}, ${contentH/renderer.height}) translateZ(0)`;

    renderer.view.style.left = offsetW + "px"
    renderer.view.style.top = offsetH + "px"

  },

  tick() {
    this.renderer.render(this.node);
    requestAnimationFrame(this.tick);
  },
  tickMobile() {
    this.renderer.render(this.node);
    setTimeout(this.tickMobile, 33);
  },
  render() {
    return (
      React.createElement('canvas', {
        ref: canvas => this.canvas = canvas,
        width: this.props.width,
        height: this.props.height,
      })
    );
  },
});

// module.exports = Surface;
