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

import core from 'core/core';
import { init as preloaderInit } from 'classes/Preloader';

/**
 * Surface is a standard React component and acts as the main drawing canvas.
 * ReactCanvas components cannot be rendered outside a Surface.
 */
export const Surface = React.createClass({

  propTypes: {
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
    this.node = core.getStage();

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
  },

  componentWillUnmount() {
    // Implemented in ReactMultiChild.Mixin
    this.unmountChildren();
    this.node.removeChildren();
  },

  render() {
    return null;
  },
});

// module.exports = Surface;
