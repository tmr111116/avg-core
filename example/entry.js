require("./assets/css/style.css");

import { React, Component, render, loadResource, Surface, Image, Text, Layer, Scene, Textwindow, BGImage, FGImage } from 'iceleaf';
import DragableText from './DragableText';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
      x: 0,
      loading: false
    }
  }
  componentWillMount() {
    // loadResource(["assets/res/history.png",
    //   "assets/res/save.png",
    //   "assets/res/load.png",
    //   "assets/res/ch-3.png"])
    // .then(() => {
    //   this.state.loading
    // })
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
    // e.stopPropagation();
  }
  render() {
    return (
      <Surface width={1280} height={720}>
        <Scene ref={'scene'} script={'script.bks'} commandName='scene' width={1280} height={720}
          onLoading={() => this.setState({loading: true})} onCompleteLoading={() => this.setState({loading: false})}>
          <BGImage commandName='bg' ref='bg'/>
          <FGImage commandName='fg' ref='fg' width={1280} height={720}/>
          <Textwindow commandName='text' ref='tw' onClick={this.handleClick.bind(this)} x={126} y={470}>
            {this.state.show ? <Image file="assets/res/history.png" x={700} y={195}/> : null}
            <Image file="assets/res/save.png" x={800} y={195}/>
            <Image file="assets/res/load.png" x={900} y={195}/>
          </Textwindow>
          <DragableText text="可拖拽文字组件" color={0x66ccff} x={935} y={625}/>
        </Scene>
        {this.state.loading ? <DragableText text="加载中" color={0x66ccff} x={600} y={300}/> : null}
      </Surface>
    )
  }
}

render(<Game />, document.getElementById('app'));
