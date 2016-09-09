import { React, Component, Text } from 'iceleaf';

export default class DragableText extends Component {
	state = {
		clicked: false,
		x: this.props.x || 0,
		y: this.props.y || 0
	}
	handleTextMouseDown(e) {
		this.setState({
			clicked: true,
			startX: this.state.x,
			startY: this.state.y,
			startGlobalX: e.global.x,
			startGlobalY: e.global.y
		});
	}
	handleTextMouseUp(e) {
		this.setState({
			clicked: false
		});
	}
	handleTextMouseMove(e) {
		if (this.state.clicked) {
			let state = this.state;
			this.setState({
				x: state.startX + (e.global.x - state.startGlobalX),
				y: state.startY + (e.global.y - state.startGlobalY)
			})
		}
	}
	render() {
		return <Text {...this.props}
		onMouseDown={this.handleTextMouseDown.bind(this)} onTouchStart={this.handleTextMouseDown.bind(this)}
		onMouseUp={this.handleTextMouseUp.bind(this)} onTouchEnd={this.handleTextMouseUp.bind(this)}
		onMouseMove={this.handleTextMouseMove.bind(this)} onTouchMove={this.handleTextMouseMove.bind(this)}
		x={this.state.x} y={this.state.y} />
	}
}
