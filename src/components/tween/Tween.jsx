import React from 'react';
import core from 'core/core';
import { Layer } from '../Layer';
import TweenGenerator from './perform';
import tweenBuilder from './util';

const logger = core.getLogger('Tween');

export default class Tween extends React.Component {
  constructor(props) {
    super(props);

    const properties = {};
    React.Children.map(this.props.children, (element) => {
      properties[element.key] = { ...element.props, children: null };
    });
    this.state = properties;

    this.nodes = {};
    this.tweens = {};
    this.shadowState = {};

    this.runningTween = null;
  }
  componentDidMount() {
    this.registerTweens();
  }
  componentWillUnmount() {
    // for (const key of Object.keys(this.tweens)) {
    //   this.tweens[key].stop();
    // }
    // this.tweens[Symbol.for('tween-setState')].stop();
  }
  registerTweens() {
    const schemeNames = Object.keys(this.props.schemes);

    for (const schemeName of schemeNames) {
      const scheme = this.props.schemes[schemeName];
      this.tweens[schemeName] = TweenGenerator(scheme, this.nodes)[0];
    }

    this.runTween('default');
  }
  runTween(name) {
    const tween = this.tweens[name];
    if (tween) {
      this.runningTween && this.runningTween.stop();
      this.runningTween = tween;
      // tween.start();
      let finished = false;
      PIXI.ticker.shared.add(() => {
        !finished && (finished = tween.update(performance.now()));
      });
    } else {
      logger.warn(`Scheme ${name} is not defined.`);
    }
  }
  getNodes(key, element) {
    if (element) {
      this.nodes[key] = element._reactInternalInstance._mountImage;
    }
  }
  render() {
    this.nodes = {};
    const element = React.Children.map(this.props.children, (element) => {
      // const originState = this.state[element.key];
      // const updatedState = this.shadowState[element.key];
      return React.cloneElement(element, {
        // ...originState, ...updatedState,
        ref: (node) => { element.ref && element.ref(node); this.getNodes(element.key, node); },
      });
    });
    return <Layer>{ element }</Layer>;
  }
}

export class Lite extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.children.props;
  }
  tween = null;
  componentDidMount() {
    const keys = Object.keys(this.props.to);

    const ctx = {};
    const target = {};
    for (const key of keys) {
      ctx[key] = this.state[key];
      target[key] = this.props.to[key];
    }

    this.tween = new TWEEN.Tween(ctx)
    // .delay(2000)
    .to(target, this.props.duration)
    .repeat(this.props.repeat)
    .yoyo(this.props.yoyo)
    .easing(TWEEN.Easing.Sinusoidal.In)
    .onUpdate(() => {
      this.setState(ctx);
    })
    .start();
  }
  componentWillUnmount() {
    this.tween.stop();
  }
  render() {
    if (this.props.children instanceof Array) {
      throw 'Don\'t support more than one child in Tween.';
    }
    const element = React.cloneElement(this.props.children, {
      ...this.state,
    });
    return element;
  }
}
