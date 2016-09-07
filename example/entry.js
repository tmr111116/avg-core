/**@jsx createElement*/

require("./assets/css/style.css");
// import * as iceleaf from 'iceleaf';
import {createElement, render, Component, Sprite, Text, Scene, Layer, FGImage} from 'iceleaf';
import Stroy from './ui';


export class Test extends Component {
	componentDidMount() {
		console.log('模块Test已挂载！');
		this.setState({
			xx: true
		})
	}
	render() {
		return (
			<Sprite file="assets/res/textwindow.png">
					<Sprite file="assets/res/ch-1.png" x={100} y={100}/>
					{this.state.xx ? <Sprite file="assets/res/ch-2.png" x={130} y={100} /> : null}
					<Sprite file="assets/res/ch-3.png" x={160} y={100} />
			</Sprite>
		)
	}
}



iceleaf.render(<Test />);
