import PIXI from '../Library/pixi.js/src/index';
import React from 'react';
import { Container } from 'core/Container';
import { CrossFadeFilter } from 'Classes/Transition/Filters';

export class Transition extends React.Component {
  componentWillMount() {

  }
  componentWillUpdate() {
    const layer = this.refs.layer._reactInternalInstance._renderedComponent.node;
    console.log(layer);
    const renderer = PIXI.currentRenderer;
    layer.prepareTransition(renderer);
  }
  componentDidUpdate() {
    const layer = this.refs.layer._reactInternalInstance._renderedComponent.node;
    const renderer = PIXI.currentRenderer;
    layer.startTransition(renderer, new CrossFadeFilter());
  }
  render() {
    return (
      <Container ref="layer">
        {this.props.children}
      </Container>
    );
  }
}
