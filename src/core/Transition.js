import PIXI from '../Library/pixi.js/src/index';
import React from 'react';
import { Container } from 'core/Container';
import { CrossFadeFilter } from 'Classes/Transition/Filters';

export class Transition extends React.Component {
	componentWillMount() {

	}
	componentWillUpdate() {
		let layer = this.refs.layer._reactInternalInstance._renderedComponent.node;
		console.log(layer)
		let renderer = PIXI.currentRenderer;
		layer.prepareTransition(renderer);
	}
	componentDidUpdate() {
		let layer = this.refs.layer._reactInternalInstance._renderedComponent.node;
		let renderer = PIXI.currentRenderer;
		layer.startTransition(renderer, new CrossFadeFilter);
	}
	render() {
		return (
			<Container ref='layer'>
				{this.props.children}
			</Container>
		)
	}
}
