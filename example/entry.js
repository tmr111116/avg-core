require("./assets/css/style.css");

import { React, Component, render, Surface, Image, Text, Layer, Scene, Textwindow, BGImage, FGImage } from 'iceleaf';
import DragableText from './DragableText';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
      x: 0
    }
  }
  componentDidMount() {
    let scene = this.refs.scene;
    scene.bindCommand([this.refs.tw, this.refs.fg, this.refs.bg]);
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
          <BGImage commandName='bg' ref='bg'/>
          <Textwindow
          color={0x0} visible={true} commandName={'text'} ref={'tw'}
          onClick={this.handleClick.bind(this)}>
            <DragableText text="测试文字 - 天依蓝" color={0x66ccff} x={100} y={100}/>
            {this.state.show ? <Image file="assets/res/ch-2.png" x={80} y={100}/> : null}
          </Textwindow>
          <FGImage commandName={'fg'} ref={'fg'} width={1280} height={720}/>
        </Scene>
      </Surface>
    )
  }
}

render(<Game />, document.getElementById('app'));
