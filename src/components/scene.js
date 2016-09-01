/**@jsx createElement*/

import { createElement } from 'core/core';
import { Component } from 'core/component';
import { Layer } from 'components/layer';
import { attachToSprite } from 'Classes/EventManager';

export class Scene extends Component {
	constructor(props) {
		super(props);
	}
	componentWillReceiveProps(nextProps) {
		
	}
	render() {
		return <Layer {...this.props}>{this.props.children}</Layer>;
	}
}
