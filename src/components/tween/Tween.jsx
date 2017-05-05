/**
 * @file        Tween component
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
import PropTypes from 'prop-types';
import core from 'core/core';
import { Layer } from '../Layer';
import tweenGenerator from './perform';

const logger = core.getLogger('Tween');

class Tween extends React.Component {
  static propTypes = {
    schemes: PropTypes.object,
    children: PropTypes.any
  }
  constructor(props) {
    super(props);

    this.nodes = {};
    this.tweens = {};
    this.shadowState = {};

    this.tempSymbol = Symbol('tween');
    this.runningTween = [];
  }
  componentDidMount() {
    this.registerTweens();
  }
  componentWillUnmount() {
    for (const key of Object.keys(this.tweens)) {
      this.tweens[key].stop();
    }
  }
  registerTweens() {
    const schemeNames = Object.keys(this.props.schemes || {});

    for (const schemeName of schemeNames) {
      const scheme = this.props.schemes[schemeName];

      this.tweens[schemeName] = tweenGenerator(scheme, this.nodes);
    }

    if (schemeNames.includes('default')) {
      this.runTween('default');
    }
  }
  runTween(name) {
    const tween = this.tweens[name];

    if (tween) {
      this.runningTween[name] && this.runningTween[name].stop();
      this.runningTween[name] = tween;
      tween.start();
    } else {
      logger.warn(`Scheme ${name} is not defined.`);
    }
  }
  stopTween(name) {
    this.runningTween[name] && this.runningTween[name].stop();
  }
  runScheme(scheme, name = this.tempSymbol) {
    const tween = tweenGenerator(scheme, this.nodes);

    this.runningTween[name] && this.runningTween[name].stop();
    this.runningTween[name] = tween;

    tween.start();
  }
  getNodes(key, element) {
    if (element) {
      this.nodes[key] = element._reactInternalInstance._mountImage;
    }
  }
  render() {
    this.nodes = {};
    const elements = React.Children.map(this.props.children, element =>
      // const originState = this.state[element.key];
      // const updatedState = this.shadowState[element.key];
    element && React.cloneElement(element, {
      // ...originState, ...updatedState,
      ref: node => { element.ref && element.ref(node); this.getNodes(element.key, node); },
    }));

    return <Layer {...this.props}>{ elements }</Layer>;
  }
}

// class Lite extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = props.children.props;
//   }
//   tween = null;
//   componentDidMount() {
//     const keys = Object.keys(this.props.to);

//     const ctx = {};
//     const target = {};
//     for (const key of keys) {
//       ctx[key] = this.state[key];
//       target[key] = this.props.to[key];
//     }

//     this.tween = new TWEEN.Tween(ctx)
//     // .delay(2000)
//     .to(target, this.props.duration)
//     .repeat(this.props.repeat)
//     .yoyo(this.props.yoyo)
//     .easing(TWEEN.Easing.Sinusoidal.In)
//     .onUpdate(() => {
//       this.setState(ctx);
//     })
//     .start();
//   }
//   componentWillUnmount() {
//     this.tween.stop();
//   }
//   render() {
//     if (this.props.children instanceof Array) {
//       throw 'Don\'t support more than one child in Tween.';
//     }
//     const element = React.cloneElement(this.props.children, {
//       ...this.state,
//     });
//     return element;
//   }
// }

// Tween.Lite = Lite;

export default Tween;
