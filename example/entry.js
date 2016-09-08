require("./assets/css/style.css");

// import React from 'react';
// import ReactDOM from 'react-dom';

import { React, Component, render, Surface, Image } from 'iceleaf';
// import Surface from 'core/Surface';
// import Image from 'core/Image';
// import Text from 'core/Text';

class Test extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show2: true,
			x: 0
		}
	}
	handleClickA(e) {
		this.setState({
			show2: false,
			x: this.state.x + 10
		})
	}
	handleClickB(e) {
		this.setState({
			show2: true,
			x: this.state.x - 10
		})
	}
	render() {
		return (
			<div>
				<button onClick={this.handleClickA.bind(this)}>测试按钮A</button>
				<button onClick={this.handleClickB.bind(this)}>测试按钮B</button>
				<Surface width={1280} height={720}>
					<Image file="assets/res/BG32a_1280.jpg" ref='bg'>
						<Image file="assets/res/textwindow.png" onClick={this.handleClickA.bind(this)}>
						{this.state.show2 ? <Image file="assets/res/ch-2.png" x={80} y={100}/> : null}
							<Image file="assets/res/ch-1.png" x={50} y={100}/>
							<Image file="assets/res/ch-3.png" x={110+this.state.x} y={100}/>
						</Image>
					</Image>
				</Surface>
			</div>
		)
	}
}
// <Image file="assets/res/BG32a_1280.jpg">
// 	<Image file="assets/res/textwindow.png">
// 		<Image file="assets/res/ch-1.png" x={50} y={100}/>
// 		{this.state.show2 ? <Image file="assets/res/ch-2.png" x={80} y={100}/> : null}
// 		<Image file="assets/res/ch-3.png" x={110} y={100}/>
// 	</Image>
// </Image>
// <Image file="assets/res/ch-2.png" x={80+this.state.x} y={100}/>
//<Image style={{width: 960, height: 480}} src="assets/res/BG32a_1280.jpg" />
render(<Test />, document.body)
