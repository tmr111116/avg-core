require("./assets/css/style.css");

import { React, Component, render, Surface, Image, Text, Layer, Scene, Textwindow } from 'iceleaf';
import DragableText from './DragableText';

class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
      x: 0
    }
  }
  componentDidMount() {
    let scene = this.refs.scene;
    scene.bindCommand([this.refs.tw]);
  }
  handleClick(e) {
    this.setState({
      show: !this.state.show,
      x: this.state.x + 10
    });
    e.stopPropagation();
  }
  render() {
    return (
      <Surface width={1280} height={720}>
        <Scene ref={'scene'} script={'script.bks'}>
        <Image file="assets/res/BG32a_1280.jpg" ref='bg' width={640} height={480} color={0xff6600}>
          <Textwindow bgFile="assets/res/textwindow.png"
          color={0x0} visible={true} ref={'tw'} commandName={'text'}
          onClick={this.handleClick.bind(this)}>
            <DragableText text="测试文字 - 天依蓝" color={0x66ccff} x={100} y={100}/>
            {this.state.show ? <Image file="assets/res/ch-2.png" x={80} y={100}/> : null}
            <Image file="assets/res/ch-1.png" x={50} y={100}/>
            <Image file="assets/res/ch-3.png" x={110+this.state.x} y={100}/>
          </Textwindow>
        </Image>
        </Scene>
      </Surface>
    )
  }
}

render(<Test />, document.getElementById('app'));
