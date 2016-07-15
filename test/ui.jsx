/**@jsx createElement*/

import {createElement, render, Component} from 'Iceleaf';

function handler() {
	alert('clicked!');
}

class SpriteWithText extends Component {
	constructor(props) {
		super(props);
	}
	handleClick() {
		console.log('文字框内文字被点击！');
	}
	render() {
		return (
			<Sprite file="assets/res/textwindow.png" x={this.props.x||0} y={this.props.y||0}>
			<Text text='文字框内文字'
				  color={0x000} size={20} x={50} y={50}
	        	  font="思源黑体 Regular,思源黑体" onClick={this.handleClick}/>
			</Sprite>
		)
	}
}

module.exports = (
	<Sprite file="assets/res/BG32a_1280.jpg">
		<SpriteWithText x={100} y={450}/>
	</Sprite>
)
