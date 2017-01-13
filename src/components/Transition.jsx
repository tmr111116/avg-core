/**
 * @file        Transition component
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
import core from 'core/core';
import { Container } from 'components/Container';
import { CrossFadeFilter } from 'classes/Transition/Filters';

const PIXI = require('pixi.js');

export class Transition extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
  }
  componentWillUpdate() {
    const node = this.node._reactInternalInstance._renderedComponent.node;
    const renderer = core.getRenderer();
    node.prepareTransition(renderer);
  }
  componentDidUpdate() {
    const node = this.node._reactInternalInstance._renderedComponent.node;
    const renderer = core.getRenderer();
    node.startTransition(renderer, new CrossFadeFilter());
  }
  render() {
    return (
      <Container ref={node => this.node = node}>
        {this.props.children}
      </Container>
    );
  }
}
