import PIXI from 'Library/pixi.js/src/index';
import React from 'react';
import { Container } from 'core/Container';
import { CrossFadeFilter } from 'Classes/Transition/Filters';

export class Transition extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
  }
  componentWillUpdate() {
    const node = this.node._reactInternalInstance._renderedComponent.node;
    const renderer = PIXI.currentRenderer;
    node.prepareTransition(renderer);
  }
  componentDidUpdate() {
    const node = this.node._reactInternalInstance._renderedComponent.node;
    const renderer = PIXI.currentRenderer;
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
