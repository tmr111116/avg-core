require("./assets/css/style.css");

import { React, Component, render, Surface, Image, Text } from 'iceleaf';
import DragableText from './DragableText';

class Test extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: true,
			x: 0
		}
	}
	handleClick(e) {
		this.setState({
			show: !this.state.show,
			x: this.state.x + 10
		})
	}
	render() {
		return (
			<div>
				<Surface width={1280} height={720}>
					<Image file="assets/res/BG32a_1280.jpg" ref='bg'>
						<Image file="assets/res/textwindow.png" onClick={this.handleClick.bind(this)}>
							<DragableText text="测试文字 - 天依蓝" color={0x66ccff} x={100} y={100}/>
							{this.state.show ? <Image file="assets/res/ch-2.png" x={80} y={100}/> : null}
							<Image file="assets/res/ch-1.png" x={50} y={100}/>
							<Image file="assets/res/ch-3.png" x={110+this.state.x} y={100}/>
						</Image>
					</Image>
				</Surface>
			</div>
		)
	}
}

render(<Test />, document.getElementById('app'));
