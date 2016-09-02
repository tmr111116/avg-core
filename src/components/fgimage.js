/**@jsx createElement*/
import { createElement } from 'core/core';
import { Component } from 'core/component';
import { Sprite } from 'components/sprite';
import { Container } from 'components/container';

export class FGImage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			file: null,
			x: 0,
			y: 0
		}

		this.disableBinding = false;
	}
	commandHandler(params, flags, name) {
		console.log(params)
		this.setState({...params});
	}
	render() {
		return <Sprite file={this.state.file || "assets/res/ch1.png"} x={this.state.x} y={this.state.y} />
	}
}
